import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { BsInfoCircle, BsHeartFill, BsGlobe, BsFlag } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import BackButton from '../components/BackButton';
import Waves from '../components/Waves';
import { useAuth } from '../context/AuthContext'; // Add this import

const Favorites = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { user, syncFavorites, isAuthenticated } = useAuth(); // Get auth context
  
  // Initialize favorites from user data or localStorage
  const [favorites, setFavorites] = useState(() => {
    // If user is logged in, prefer their server-stored favorites
    if (user && user.favorites) {
      return user.favorites;
    } else {
      // Fall back to localStorage for non-logged in users
      const savedFavorites = localStorage.getItem('favoriteCountries');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    }
  });

  // Save favorites to localStorage and sync with server if user is authenticated
  useEffect(() => {
    localStorage.setItem('favoriteCountries', JSON.stringify(favorites));
    
    // If user is authenticated, sync favorites with server
    if (isAuthenticated) {
      syncFavorites(favorites);
    }
  }, [favorites, isAuthenticated, syncFavorites]);

  // Fetch all countries once
  useEffect(() => {
    setLoading(true);
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setAllCountries(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
        enqueueSnackbar('Failed to fetch country data', { variant: 'error' });
        setLoading(false);
      });
  }, [enqueueSnackbar]);

  // Filter countries based on favorite codes
  useEffect(() => {
    if (allCountries.length > 0) {
      const filtered = allCountries.filter(country => favorites.includes(country.cca3));
      setFavoriteCountries(filtered);
    } else {
      setFavoriteCountries([]);
    }
  }, [allCountries, favorites]);

  // Remove from favorites
  const removeFavorite = useCallback((countryCode) => {
    setFavorites(prevFavorites => {
      enqueueSnackbar('Removed from favorites', { variant: 'info' });
      return prevFavorites.filter(code => code !== countryCode);
    });
  }, [enqueueSnackbar]);

  const formatPopulation = (population) => {
    return population ? population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'N/A';
  };

  // Update your animation variants for more reliable animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 12,
        duration: 0.5 
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#121212] to-[#030303] text-white relative">
      {/* Waves background - fixed position */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Waves
          lineColor="rgba(255, 255, 255, 0.15)"
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
        {/* Header Section */}
        <div className="container mx-auto mt-8 mb-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <BackButton destination="/" />
            
            <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#A64AC9] to-[#17E9E0] flex items-center">
              <span>Your Favorites</span>
            </div>

            <div className="w-10">
              {/* Empty div for flexbox alignment */}
            </div>
          </motion.div>
        </div>

        <main className="container mx-auto px-4 py-4 flex-grow relative z-10">
          {/* Counter display */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="px-6 py-3 bg-gradient-to-r from-[#332845] to-[#0d3232] border border-[#A64AC9]/30 rounded-full inline-flex items-center shadow-lg shadow-purple-900/10">
              <BsFlag className="mr-3 text-[#17E9E0]" />
              <p className="text-white">
                {loading ? 'Loading favorites...' : (
                  <>
                    You have <span className="font-bold text-[#17E9E0]">{favoriteCountries.length}</span> favorite {favoriteCountries.length === 1 ? 'country' : 'countries'}
                  </>
                )}
              </p>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : favoriteCountries.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              style={{ willChange: "opacity, transform" }} // Optimization for animations
            >
              {favoriteCountries.map((country) => (
                <motion.div 
                  key={country.cca3} 
                  variants={itemVariants} 
                  initial="hidden"  // Force initial state
                  animate="visible" // Force visible state
                  className="relative overflow-hidden group rounded-2xl border-2 border-[#A64AC9] transition-all duration-300 hover:border-[#17E9E0] bg-[#1c1c1c] shadow-lg shadow-purple-900/20 hover:shadow-[#17E9E0]/20"
                >
                  {/* Remove Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(country.cca3);
                    }}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white text-red-500 hover:scale-110 transition-all duration-200 shadow-lg"
                    aria-label="Remove from favorites"
                  >
                    <BsHeartFill className="text-lg" />
                  </button>
                  
                  <Link to={`/country/${country.cca3}`} className="block">
                    <div className="flex flex-col h-[280px] overflow-hidden">
                      {/* Flag with enhanced overlay */}
                      <div className="relative h-44 overflow-hidden">
                        <img 
                          src={country.flags?.png || country.flags?.svg}
                          alt={`Flag of ${country.name.common}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
                        
                        {/* Add country name overlay on the flag for better visibility */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60">
                          <h3 className="text-lg font-bold text-white">
                            {country.name.common}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Country Details with Enhanced Styling */}
                      <div className="flex-1 p-4 bg-[#1c1c1c] flex flex-col justify-between border-t border-[#A64AC9]">              
                        <div className="mt-1 flex flex-col gap-1.5">
                          <div className="flex items-center text-white text-sm">
                            <span className="w-20 text-[#A64AC9]">Region:</span>
                            <span className="font-medium text-white">{country.region}</span>
                          </div>
                          
                          {country.capital && (
                            <div className="flex items-center text-white text-sm">
                              <span className="w-20 text-[#A64AC9]">Capital:</span>
                              <span className="font-medium text-white">{country.capital[0]}</span>
                            </div>
                          )}
                          
                          {country.population && (
                            <div className="flex items-center text-white text-sm">
                              <span className="w-20 text-[#A64AC9]">Population:</span>
                              <span className="font-medium text-white">{formatPopulation(country.population)}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 flex justify-end">
                          <div className="inline-flex items-center text-xs text-white bg-[#A64AC9] hover:bg-[#A64AC9]/90 px-3 py-1.5 rounded-full transition-colors duration-200">
                            <BsInfoCircle className="mr-1.5" />
                            <span>View details</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 border border-[#A64AC9]/30 rounded-3xl bg-[#1c1c1c] shadow-lg shadow-purple-900/10"
            >
              <div className="inline-block p-6 border border-[#A64AC9]/20 rounded-full mb-6 bg-[#271c35]">
                <BsGlobe className="text-6xl text-[#17E9E0]" />
              </div>
              <p className="text-white text-xl mb-6">You haven't added any countries to your favorites yet</p>
              <Link
                to="/"
                className="bg-gradient-to-r from-[#A64AC9] to-[#17E9E0] text-white px-6 py-3 rounded-lg hover:from-[#8A39A6] hover:to-[#17E9E0] transition-all duration-300 shadow-lg font-medium"
              >
                Explore Countries
              </Link>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Favorites;