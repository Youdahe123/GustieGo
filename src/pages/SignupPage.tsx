import React from 'react';
import SignupForm from '@/components/SignupForm';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = (email: string, isAdmin?: boolean) => {
    // Store user info in localStorage (similar to login)
    localStorage.setItem('gustieGo_user', email);
    localStorage.setItem('gustieGo_isAdmin', isAdmin?.toString() || 'false');
    
    // Redirect to main app
    navigate('/');
  };

  return <SignupForm onSignup={handleSignup} />;
};

export default SignupPage; 