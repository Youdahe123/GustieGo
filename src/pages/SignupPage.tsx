import React from 'react';
import SignupForm from '@/components/SignupForm';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = (email: string, isAdmin?: boolean) => {
    // TODO: Replace with actual API call
    // API Endpoint: POST /auth/register
    // const response = await fetch('/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, password, role })
    // });
    // const data = await response.json();
    
    // Store user info in localStorage (similar to login)
    localStorage.setItem('gustieGo_user', email);
    localStorage.setItem('gustieGo_isAdmin', isAdmin?.toString() || 'false');
    
    // Redirect to main app
    navigate('/');
  };

  return <SignupForm onSignup={handleSignup} />;
};

export default SignupPage; 