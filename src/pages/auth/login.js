import React, { useState, useEffect, useRef, Suspense } from 'react';
import { auth, provider } from '../../firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Heading, Input, Label, AuthLayout, ErrorMessage, Loader } from '../../components';
import { useAuth } from '../../contexts';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera } from '@react-three/drei';
import * as THREE from "three";
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
  const { scene } = useGLTF('https://dl.dropboxusercontent.com/s/xahl8x7tb7deiz775kyx4/mecanic_eye.glb?rlkey=9d018nqmacb6fibgcswyqppux&st=cttrtprt');
  const eyeRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (scene) {
      scene.position.set(0, 0, 0);
      camera.position.set(0, 0, 3);
      camera.updateProjectionMatrix();
      onLoad(); // Call this when the model is ready
    }
  }, [scene, camera, onLoad]);

  useFrame(() => {
    if (eyeRef.current) {
      eyeRef.current.rotation.y = mousePosition.x * 0.5;
      eyeRef.current.rotation.x = -mousePosition.y * 0.5;
    }
  });

  if (!scene) return null;

  return <primitive object={scene} ref={eyeRef} scale={[1, 1, 1]} />;
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Log In';
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsLoading(true);
    let validationErrors = {};

    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      validationErrors.email = 'Invalid email address';
    }

    if (!password) {
      validationErrors.password = 'Password is required';
    } else if (password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        navigate("/dashboard");
        console.log(result.user);
        setIsLoading(false);
        toast.success('Successfully signed in!');
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(`Error: ${error.message}`);
      });
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user);
        navigate("/dashboard");
        toast.success('Successfully signed in with Google!');
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
      });
  };

  const handleBack = () => {
    navigate(-1);
  };

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
      <div className="flex justify-between items-center mb-4">
        <Heading>Login</Heading>
      </div>
      <div className="relative">
        {isModelLoading && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <Loader1 />
          </div>
        )}
        <Canvas>
          <PerspectiveCamera makeDefault fov={50} position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <directionalLight position={[-5, 5, 5]} intensity={1} />
          <Environment preset="studio" />
          <Suspense fallback={null}>
            <MechanicalEye
              mousePosition={mousePosition}
              onLoad={() => setIsModelLoading(false)}
            />
          </Suspense>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>
      <form onSubmit={handleSignIn}>
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ErrorMessage message={errors.email} />
        </div>
        <div className="mb-6">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ErrorMessage message={errors.password} />
        </div>
        <div className="flex items-center justify-between flex-row-reverse">
          <Button
            type="submit"
            className={
              !isLoading ? "bg-blue-500 hover:bg-blue-700 text-white" : ""
            }
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Sign In"}
          </Button>
          <Link
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            to="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
      <div className="my-3">
        if you don't have an account,{" "}
        <Link to="/signup" className="text-blue-500 hover:text-blue-800">
          sign up
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
          <span className="ml-2">Sign in with Google</span>
        </Button>
      </div>
    </AuthLayout>
  );
}

export default Login;