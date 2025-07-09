
import React, { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import AdminDashboard from '@/components/AdminDashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check for existing session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('gustieGo_user');
    const savedIsAdmin = localStorage.getItem('gustieGo_isAdmin') === 'true';
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsAdmin(savedIsAdmin);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (studentId: string, adminStatus: boolean = false) => {
    setCurrentUser(studentId);
    setIsAdmin(adminStatus);
    setIsLoggedIn(true);
    localStorage.setItem('gustieGo_user', studentId);
    localStorage.setItem('gustieGo_isAdmin', adminStatus.toString());
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    setIsAdmin(false);
    localStorage.removeItem('gustieGo_user');
    localStorage.removeItem('gustieGo_isAdmin');
  };

  return (
    <>
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : isAdmin ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <Dashboard studentId={currentUser} onLogout={handleLogout} />
      )}
    </>
  );
};

export default Index;
