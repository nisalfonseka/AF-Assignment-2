import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsHeartFill, BsPersonCircle, BsBoxArrowRight, BsPersonPlus, BsGearFill } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import RotatingText from './RotatingText';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setUserMenuOpen(false);
    };

    if (userMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    };

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`sticky top-0 z-50 ${scrolled
          ? 'bg-black/80 backdrop-blur-md'
          : 'bg-black'
        } text-white shadow-md transition-all duration-300`}
      role="banner"
    >
      <div className="container mx-auto p-4 flex justify-between items-center">
        {/* Logo with Rotating Text */}
        <Link
          to="/"
          className="flex items-center space-x-3 group"
          aria-label="World Explorer - Home"
        ><div>
            <h1 className="text-5xl font-bold tracking-wide">
              <span className="text-white">World</span>
            </h1>
          </div>
          <RotatingText
            texts={['Maps', 'Details', 'Explore']}
            mainClassName="px-2 py-1 bg-white text-black font-bold text-5xl overflow-hidden rounded-lg"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />

        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block" aria-label="Main Navigation">
          <ul className="flex space-x-8 items-center">
            <li>
              <Link
                to="/"
                className="text-white hover:text-gray-300 transition-colors font-medium relative group py-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-md"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>

            <li>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/favorites"
                  className="flex items-center bg-white text-black font-bold px-5 py-2 rounded-md shadow-md hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="View your favorite countries"
                >
                  <BsHeartFill className="mr-2" aria-hidden="true" />
                  <motion.span>
                    Favorites
                  </motion.span>
                </Link>
              </motion.div>
            </li>

            {/* User Account Section */}
            {isAuthenticated ? (
              <li className="relative">
                <button
                  className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                >
                  <BsPersonCircle className="text-xl" />
                  <span className="font-medium truncate max-w-[120px]">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-md shadow-lg py-1 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        to="/profile"
                        className="flex w-full items-center px-4 py-2 text-sm text-white hover:bg-white/10"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <BsGearFill className="mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-white hover:bg-white/10"
                      >
                        <BsBoxArrowRight className="mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ) : (
              <li className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-gray-300 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center bg-white text-black px-4 py-1.5 rounded-md font-medium hover:bg-gray-200 transition-all duration-300"
                >
                  <BsPersonPlus className="mr-1" />
                  Register
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md p-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 relative">
            <span
              className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45 top-3' : 'rotate-0 top-1'
                }`}
            ></span>
            <span
              className={`absolute h-0.5 bg-white transform transition-all duration-300 ease-in-out ${isOpen ? 'w-0 opacity-0 left-1/2' : 'w-full opacity-100 top-3'
                }`}
            ></span>
            <span
              className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45 top-3' : 'rotate-0 top-5'
                }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/20 backdrop-blur-md bg-black/90"
            role="navigation"
            aria-label="Mobile Navigation"
          >
            <nav className="container mx-auto px-4 py-4">
              <ul className="flex flex-col space-y-4">
                <li>
                  <Link
                    to="/"
                    className="text-white hover:text-gray-300 text-lg font-medium block py-2 px-3 transition-colors rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/favorites"
                    className="flex items-center bg-white text-black font-bold px-5 py-2 rounded-md shadow-md hover:bg-gray-200 transition-all duration-300 focus:outline-none w-full justify-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <BsHeartFill className="mr-2" aria-hidden="true" />
                    Favorites
                  </Link>
                </li>

                {/* Mobile Auth Links */}
                {isAuthenticated ? (
                  <>
                    <li className="pt-2 border-t border-white/20">
                      <div className="px-3 py-2 text-gray-300">
                        Logged in as <strong>{user.name}</strong>
                      </div>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        className="flex items-center w-full text-white hover:text-gray-300 text-lg font-medium py-2 px-3 transition-colors rounded-md hover:bg-white/10"
                        onClick={() => setIsOpen(false)}
                      >
                        <BsGearFill className="mr-2" />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="flex items-center w-full text-white hover:text-gray-300 text-lg font-medium py-2 px-3 transition-colors rounded-md hover:bg-white/10"
                      >
                        <BsBoxArrowRight className="mr-2" />
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="pt-2 border-t border-white/20">
                      <Link
                        to="/login"
                        className="text-white hover:text-gray-300 text-lg font-medium block py-2 px-3 transition-colors rounded-md hover:bg-white/10"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="flex items-center justify-center bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-all duration-300 w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        <BsPersonPlus className="mr-2" />
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;