import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { BsPersonCircle, BsEnvelope, BsHeartFill, BsShieldLock, BsExclamationTriangle } from 'react-icons/bs';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Waves from '../components/Waves';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
      
      // Get favorite count from localStorage or user data
      const savedFavorites = localStorage.getItem('favoriteCountries');
      const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
      setFavoriteCount(favorites.length);
    }
  }, [isAuthenticated, navigate, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data if canceling edit
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // This is a placeholder for the actual update logic
    // In a real implementation, you would call an API to update the user profile
    try {
      // Simulating an API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
      setIsEditing(false);
    } catch (error) {
      enqueueSnackbar('Failed to update profile', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    
    // This is a placeholder for the actual delete account logic
    // In a real implementation, you would call an API to delete the user account
    try {
      // Simulating an API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      logout();
      enqueueSnackbar('Account deleted successfully', { variant: 'info' });
      navigate('/');
    } catch (error) {
      enqueueSnackbar('Failed to delete account', { variant: 'error' });
      setIsLoading(false);
    }
  };

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      {/* Waves background - fixed position */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Waves
          lineColor="rgba(255, 255, 255, 0.3)"
          backgroundColor="transparent"
          waveSpeedX={0.01}
          waveSpeedY={0.005}
          waveAmpX={35}
          waveAmpY={10}
          friction={0.92}
          tension={0.008}
          maxCursorMove={100}
          xGap={15}
          yGap={40}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
      
        
        <main className="container mx-auto p-4 flex-grow">
          <div className="mb-6 flex justify-between items-center">
            <BackButton />
          </div>

          {isAuthenticated && user ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Profile Header */}
              <motion.div variants={itemVariants} className="flex flex-col lg:flex-row items-center justify-between bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left mb-6 md:mb-0">
                  <div className="bg-gradient-to-br from-[#A64AC9]/30 to-[#17E9E0]/30 p-1 rounded-full mb-4 md:mb-0 md:mr-6">
                    <div className="bg-white/10 p-3 rounded-full w-24 h-24 md:w-28 md:h-28 flex items-center justify-center backdrop-blur-sm">
                      <BsPersonCircle className="text-5xl md:text-6xl text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                      {user.name}
                    </h1>
                    <p className="flex items-center justify-center md:justify-start text-gray-300 mb-3">
                      <BsEnvelope className="mr-2" /> {user.email}
                    </p>
                    <div className="flex items-center justify-center md:justify-start space-x-4">
                      <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <BsHeartFill className="text-[#FF7EB9] mr-1" /> {favoriteCount} Favorites
                      </span>
                      <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">
                        Member since {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditToggle}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    isEditing 
                      ? 'bg-white/20 text-white border border-white/20' 
                      : 'bg-white text-black'
                  }`}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </motion.button>
              </motion.div>

              {/* Profile Form */}
              <motion.div variants={itemVariants}>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-6 text-white">
                    {isEditing ? 'Edit Profile' : 'Profile Information'}
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#A64AC9]"
                            required
                          />
                        ) : (
                          <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white">
                            {user.name}
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#A64AC9]"
                            required
                          />
                        ) : (
                          <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white">
                            {user.email}
                          </div>
                        )}
                      </div>

                      {isEditing && (
                        <div className="flex justify-end pt-6">
                          <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-[#A64AC9] to-[#17E9E0] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                          >
                            {isLoading ? <Spinner /> : 'Save Changes'}
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </motion.div>

              {/* Security Section */}
              <motion.div variants={itemVariants}>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-sm">
                  <div className="flex items-center mb-6">
                    <BsShieldLock className="text-2xl text-[#17E9E0] mr-3" />
                    <h2 className="text-2xl font-bold text-white">Security</h2>
                  </div>

                  <div className="space-y-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white/10 border border-white/20 text-white p-4 rounded-xl text-left flex justify-between items-center hover:bg-white/15 transition-colors"
                    >
                      <span className="font-medium">Change Password</span>
                      <span className="text-gray-300 text-sm">●●●●●●●●</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white/10 border border-white/20 text-white p-4 rounded-xl text-left flex justify-between items-center hover:bg-white/15 transition-colors"
                    >
                      <span className="font-medium">Two-Factor Authentication</span>
                      <span className="text-gray-300 text-sm">Not enabled</span>
                    </motion.button>

                    <div className="border-t border-white/10 pt-6">
                      {showDeleteConfirm ? (
                        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4">
                          <div className="flex items-center mb-4">
                            <BsExclamationTriangle className="text-xl text-red-400 mr-2" />
                            <h3 className="text-lg font-medium text-white">Delete Account?</h3>
                          </div>
                          <p className="text-gray-300 mb-4">This action cannot be undone. All your data will be permanently deleted.</p>
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleDeleteAccount}
                              disabled={isLoading}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                            >
                              {isLoading ? <Spinner /> : 'Confirm Delete'}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowDeleteConfirm(false)}
                              className="bg-white/10 text-white px-4 py-2 rounded-lg"
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowDeleteConfirm(true)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Delete Account
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Favorite Countries Preview */}
              <motion.div variants={itemVariants}>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <BsHeartFill className="text-2xl text-[#FF7EB9] mr-3" />
                      <h2 className="text-2xl font-bold text-white">Favorite Countries</h2>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/favorites')}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-white/15 transition-colors"
                    >
                      View All
                    </motion.button>
                  </div>

                  {favoriteCount > 0 ? (
                    <p className="text-gray-300">You have {favoriteCount} favorite countries. Visit the Favorites page to manage them.</p>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-300 mb-4">You haven't added any favorite countries yet.</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-[#FF7EB9] to-[#FCCD04] text-black px-6 py-3 rounded-lg font-medium"
                      >
                        Explore Countries
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          )}
        </main>
        
      
      </div>
    </div>
  );
};

export default Profile;