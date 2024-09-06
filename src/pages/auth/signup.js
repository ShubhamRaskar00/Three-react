import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, provider, db } from '../../firebase';
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { LoadCanvasTemplate, loadCaptchaEnginge, validateCaptcha } from 'react-simple-captcha';
import { doc, setDoc } from 'firebase/firestore';
import { Button, Heading, Input, Label, AuthLayout, ErrorMessage, Loader } from '../../components';
import { useAuth } from "../../contexts";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera } from '@react-three/drei';
import { Environment } from "@react-three/drei";

// Add this CSS to your stylesheet or use a CSS-in-JS solution
const loaderStyles = `
  .loader {
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function Loader1() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <style>{loaderStyles}</style>
      <div className="loader"></div>
    </div>
  );
}

function MechanicalEye({ mousePosition, onLoad }) {
  const { scene } = useGLTF(
    "https://dl.dropboxusercontent.com/s/uo993af3t680asm7zq5c0/portal_2_wheatly_rig.glb?rlkey=rvapg57h8xxx79d6cqsgbapva&st=2n7o2qne"
  );
  const eyeRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (scene) {
      scene.position.set(0, 0, 0);
      camera.position.set(0, 0, 4);
      camera.updateProjectionMatrix();
      onLoad();
    }
  }, [scene, camera, onLoad]);

  useFrame(() => {
    if (eyeRef.current) {
      eyeRef.current.rotation.y = mousePosition.x * 0.5;
      eyeRef.current.rotation.x = -mousePosition.y * 0.5;
    }
  });

  if (!scene) return null;

  return <primitive object={scene} ref={eyeRef} scale={[2, 2, 2]} />;
}

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Sign Up';
    loadCaptchaEnginge(6);
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password, email) => {
    const username = email.split('@')[0];
    if (password.includes(username) || password === `${username}@123`) {
      return false;
    }
    return password.length >= 6;
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value.replace(/\s/g, ''); // Remove all whitespace
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 1:
        return "bg-green-500";
      case 2:
        return 'bg-yellow-500';
      case 3:
        return "bg-red-500";
      default:
        return 'bg-gray-300';
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let validationErrors = {};

    if (!firstName) {
      validationErrors.firstName = 'First name is required';
    }

    if (!lastName) {
      validationErrors.lastName = 'Last name is required';
    }

    if (!phoneNumber) {
      validationErrors.phoneNumber = 'Phone number is required';
    }

    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      validationErrors.email = 'Invalid email address';
    }

    if (!password) {
      validationErrors.password = 'Password is required';
    } else if (!validatePassword(password, email)) {
      validationErrors.password = 'Password must be at least 6 characters and not contain the username or be in the format "username@123"';
    }

    if (!validateCaptcha(captchaInput)) {
      validationErrors.captcha = 'Invalid CAPTCHA';
    }

    if (Object.keys(validationErrors).length > 0) {
      setIsLoading(false);
      setErrors(validationErrors);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Example: Save additional user info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        phoneNumber,
        email,
      });
      setIsLoading(false);
      navigate("/dashboard");
      toast.success('Successfully signed up!');
    } catch (error) {
      setIsLoading(false);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        navigate("/dashboard");
        // Handle successful sign-in
        toast.success('Successfully signed in with Google!');
      })
      .catch((error) => {
        // Handle errors
        toast.error(`Error: ${error.message}`);
      });
  };

  const handleInputChange = (e, setter) => {
    const { value } = e.target;
    setter(value.trim());
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    // Allow only numbers and common phone number characters
    const sanitizedValue = value.replace(/[^\d+()-]/g, '');
    setPhoneNumber(sanitizedValue);
  };

  const handleBack = () => {
    navigate(-1);
  }

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) * 2 - 1;
    const y = -(clientY / innerHeight) * 2 + 1;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <AuthLayout>
      <Button
        onClick={handleBack}
        className="bg-gray-300 hover:bg-gray-400 text-black absolute top-0 left-0 m-4 rounded-full p-2"
      >
        Back
      </Button>
      <Heading>Signup</Heading>
      <div className="relative">
        {isModelLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            }}
          >
            <Loader1 />
          </div>
        )}
        <Canvas>
          <PerspectiveCamera makeDefault fov={50} position={[0, 0, 2]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <Environment preset="studio" />
          <Suspense fallback={null}>
            <MechanicalEye
              mousePosition={mousePosition}
              onLoad={() => {
                setIsModelLoading(false);
              }}
            />
          </Suspense>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>
      <form onSubmit={handleSignUp}>
        <div className="mb-4">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <ErrorMessage message={errors.firstName} />
        </div>
        <div className="mb-4">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <ErrorMessage message={errors.lastName} />
        </div>
        <div className="mb-4">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={handlePhoneChange}
          />
          <ErrorMessage message={errors.phoneNumber} />
        </div>
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => handleInputChange(e, setEmail)}
          />
          <ErrorMessage message={errors.email} />
        </div>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <div className="flex">
              {[...Array(3)].map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-2 rounded-full mr-1 ${
                    index < passwordStrength
                      ? getPasswordStrengthColor(passwordStrength)
                      : "bg-gray-300"
                  }`}
                ></span>
              ))}
            </div>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <ErrorMessage message={errors.password} />
        </div>
        <div className="mb-4">
          <Label htmlFor="captcha">CAPTCHA</Label>
          <LoadCanvasTemplate />
          <Input
            id="captcha"
            type="text"
            placeholder="Enter CAPTCHA"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className="mt-2"
          />
          <ErrorMessage message={errors.captcha} />
        </div>
        <div className="flex items-center justify-end">
          <Button
            type="submit"
            className={
              !isLoading ? "bg-blue-500 hover:bg-blue-700 text-white" : ""
            }
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Sign Up"}
          </Button>
        </div>
      </form>
      <div className="my-3">
        if you have an account,{" "}
        <Link to="/login" className="text-blue-500 hover:text-blue-800">
          sign in
        </Link>
      </div>
      <div className="text-xl font-bold text-center my-3">OR</div>
      <div className="mt-4">
        <Button
          onClick={handleGoogleSignIn}
          className="bg-gray-200 hover:bg-gray-300 w-full flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24px"
            height="24px"
          >
            <path
              fill="#4285F4"
              d="M24 9.5c3.1 0 5.6 1.1 7.5 2.9l5.6-5.6C33.4 3.5 28.9 1.5 24 1.5 14.8 1.5 7.3 7.9 4.7 16.1l6.9 5.3C13.1 15.1 18 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.5 24c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.7 7.2l7.3 5.6c4.3-4 6.7-9.9 6.7-16.8z"
            />
            <path
              fill="#FBBC05"
              d="M11.6 28.4c-1.1-3.1-1.1-6.5 0-9.6L4.7 13.5C1.7 19.1 1.7 26.9 4.7 32.5l6.9-5.3z"
            />
            <path
              fill="#EA4335"
              d="M24 46.5c5.9 0 10.9-2 14.5-5.5l-7.3-5.6c-2 1.3-4.5 2.1-7.2 2.1-6 0-11-4.1-12.8-9.6l-6.9 5.3C7.3 40.1 14.8 46.5 24 46.5z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          <span className="ml-2">Sign up with Google</span>
        </Button>
      </div>
    </AuthLayout>
  );
}

export default Signup;