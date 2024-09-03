import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { toast } from 'react-toastify';

function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        toast.success('Successfully logged out');
        navigate('/login');
      } catch (error) {
        toast.error(`Error logging out: ${error.message}`);
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div>Logging out...</div>
  );
}

export default Logout;
