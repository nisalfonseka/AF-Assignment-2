import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Details from './pages/Details';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import AppContent from '../src/components/AppContent';

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
