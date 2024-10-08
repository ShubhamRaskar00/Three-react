import React, { useState, useEffect, useRef, Suspense } from "react";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Heading,
  Input,
  Label,
  AuthLayout,
  ErrorMessage,
  Loader,
} from "../../components";
import { useAuth } from "../../contexts";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera } from "@react-three/drei";
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <style>{loaderStyles}</style>
      <div className="loader"></div>
    </div>
  );
}

function MechanicalEye({ mousePosition, onLoad }) {
  const { scene } = useGLTF(
    "https://dl.dropboxusercontent.com/s/v27f191p0qk3i6mtu4vrn/portal_corerigged_for_blender.glb?rlkey=1zom0nx5ou9k0dji7s4u4bcig&st=or6siy2p"
  );
  const eyeRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (scene) {
      scene.position.set(0, 0, 0);
      camera.position.set(0, 0, 5);
      camera.updateProjectionMatrix();

      scene.traverse((child) => {
        if (child.isMesh) {
          child.material.side = THREE.DoubleSide;
          child.material.needsUpdate = true;

          // Preserve original material color
          const originalColor = child.material.color.clone();

          // Add subtle emissive effect only to specific parts (adjust as needed)
          if (child.name.includes("Eye") || child.name.includes("Glow")) {
            child.material.emissive = new THREE.Color(0x000000);
            child.material.transparent = true;
            child.material.opacity = 0.4;
            child.material.emissiveIntensity = 0.2;
          } else {
            child.material.emissive = originalColor;
            child.material.emissiveIntensity = 0.1;
          }
        }
      });

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

  return <primitive object={scene} ref={eyeRef} scale={[0.1, 0.1, 0.1]} />;
}

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Forgot Password";
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setIsLoading(true);
    let validationErrors = {};

    if (!email) {
      validationErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      validationErrors.email = "Invalid email address";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigate("/login");
        toast.success("Password reset email sent!");
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
        setIsLoading(false);
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
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
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
        <Heading>Forgot Password</Heading>
      </div>
      <div style={{ position: "relative" }}>
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
          <PerspectiveCamera makeDefault fov={50} position={[0, 0, 5]} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <directionalLight position={[-5, 5, 5]} intensity={0.5} />
          <spotLight
            position={[0, 5, 10]}
            angle={0.3}
            penumbra={1}
            intensity={0.8}
            castShadow
          />
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
      <form onSubmit={handlePasswordReset}>
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
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePasswordReset}
            className={
              !isLoading ? "bg-blue-500 hover:bg-blue-700 text-white" : ""
            }
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Reset Password"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default ForgotPassword;
