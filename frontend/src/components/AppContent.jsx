import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BsHouse, BsHeart, BsPerson, BsGearFill, BsBoxArrowRight } from 'react-icons/bs';
import { useAuth } from '../context/AuthContext';
import Dock from './Dock';
import Home from '../pages/Home';
import Details from '../pages/Details';
import Favorites from '../pages/Favorites';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';

const AppContent = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  
  const handleSettingsClick = () => {
    setShowLogoutPopup(prev => !prev);
  };
  
  const handleLogout = () => {
    logout();
    setShowLogoutPopup(false);
    navigate('/login');
  };
  
  const dockItems = [
    { icon: <BsHouse size={18} />, label: 'Home', onClick: () => navigate('/') },
    { icon: <BsHeart size={18} />, label: 'Favorites', onClick: () => navigate('/favorites') },
    { icon: <BsPerson size={18} />, label: 'Profile', onClick: () => navigate('/profile') },
    { icon: <BsGearFill size={18} />, label: 'Settings', onClick: handleSettingsClick },
  ];

  return (
    <div className="relative min-h-screen">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/country/:code' element={<Details />} />
        <Route path='/favorites' element={<Favorites />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
      
      <div className="fixed bottom-0 left-0 w-full flex justify-center z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <Dock 
            items={dockItems}
            panelHeight={98}
            baseItemSize={80}
            magnification={110}
          />
        </div>
      </div>
      
      {/* Logout Popup */}
      <AnimatePresence>
        {showLogoutPopup && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-36 right-1/2 transform translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-4 z-50 shadow-lg"
          >
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all"
            >
              <BsBoxArrowRight size={18} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppContent;