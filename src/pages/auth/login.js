import React, { useState, useEffect } from 'react';
import { auth, provider } from '../../firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Heading, Input, Label, AuthLayout, ErrorMessage } from '../../components';
import { useAuth } from '../../contexts';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
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

  const handleSignIn = () => {
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
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        // TODO: redirect to home page
        navigate("/dashboard");
        // Handle successful sign-in
        console.log(result.user);
        toast.success('Successfully signed in!');
      })
      .catch((error) => {
        // Handle errors
        toast.error(`Error: ${error.message}`);
      });
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user);
        navigate("/dashboard");
        // TODO: redirect to home page
        // Handle successful sign-in
        toast.success('Successfully signed in with Google!');
      })
      .catch((error) => {
        // Handle errors
        toast.error(`Error: ${error.message}`);
      });
  };

  return (
    <AuthLayout>
      <Heading>Login</Heading>
      <form>
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
            onClick={handleSignIn}
            className="bg-blue-500 hover:bg-blue-700 text-white"
          >
            Sign In
          </Button>
          <Link
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            to="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
      <div className='my-3'>if you don't have an account, <Link to="/signup" className='text-blue-500 hover:text-blue-800'>sign up</Link></div>
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