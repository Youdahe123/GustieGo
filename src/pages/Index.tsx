
import React, { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');

  // Check for existing session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('cafeShiftScheduler_user');
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (studentId: string) => {
    setCurrentUser(studentId);
    setIsLoggedIn(true);
    localStorage.setItem('cafeShiftScheduler_user', studentId);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    localStorage.removeItem('cafeShiftScheduler_user');
  };

  return (
    <>
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <Dashboard studentId={currentUser} onLogout={handleLogout} />
      )}
    </>
  );
};

export default Index;
