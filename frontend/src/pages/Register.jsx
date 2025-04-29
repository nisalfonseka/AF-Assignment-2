import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { BsEnvelope, BsKey, BsPerson, BsArrowRight } from 'react-icons/bs';
import Waves from '../components/Waves';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      enqueueSnackbar('Please fill all fields', { variant: 'warning' });
      return;
    }
    
    if (password !== confirmPassword) {
      enqueueSnackbar('Passwords do not match', { variant: 'error' });
      return;
    }
    
    setLoading(true);
    try {
      await register(name, email, password);
      enqueueSnackbar('Registration successful. Please log in.', { variant: 'success' });
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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

      <div className="relative z-10 flex flex-col min-h-screen items-center justify-center px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo and title */}
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xl">🌎</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold">
                <span className="text-gray-300">World</span>
                <span className="text-white">Explorer</span>
              </h1>
            </Link>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 text-white">Create an Account</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BsPerson className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50 focus:bg-white/10 text-white"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BsEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50 focus:bg-white/10 text-white"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BsKey className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50 focus:bg-white/10 text-white"
                      placeholder="Create a strong password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BsKey className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50 focus:bg-white/10 text-white"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-[#A64AC9] to-[#17E9E0] text-white py-3 px-4 rounded-lg hover:from-[#8A39A6] hover:to-[#17E9E0] transition-all duration-300 flex items-center justify-center font-medium"
                  >
                    {loading ? (
                      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    ) : (
                      <>
                        Create Account <BsArrowRight className="ml-2" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;