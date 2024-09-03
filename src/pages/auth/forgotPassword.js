import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button, Heading, Input, Label, AuthLayout, ErrorMessage } from '../../components';
import { useAuth } from "../../contexts";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Forgot Password';
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handlePasswordReset = () => {
    let validationErrors = {};

    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      validationErrors.email = 'Invalid email address';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigate('/login');
        toast.success('Password reset email sent!');
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
      });
  };

  return (
    <AuthLayout>
      <Heading>Forgot Password</Heading>
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
          className="bg-blue-500 hover:bg-blue-700 text-white"
        >
          Reset Password
        </Button>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
