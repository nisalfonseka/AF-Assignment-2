import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { BsInfoCircle, BsHeartFill, BsGlobe, BsHeart, BsArrowLeft } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import Waves from '../components/Waves';
import TiltedCard from '../components/TiltedCard';

const Favorites = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favoriteCountries');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const { enqueueSnackbar } = useSnackbar();

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteCountries', JSON.stringify(favorites));
  }, [favorites]);

  // Fetch all countries once
  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/api/countries')
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
     

        <div className="container mx-auto mt-8 mb-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <BackButton destination="/" />
            
            <div className="text-3xl md:text-4xl font-bold text-white flex items-center">
              
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
            <div className="px-5 py-3 bg-white/5 border border-white/20 rounded-full inline-flex items-center">
              <p className="text-white/80">
                {loading ? 'Loading favorites...' : (
                  <>
                    You have <span className="font-bold text-white">{favoriteCountries.length}</span> favorite {favoriteCountries.length === 1 ? 'country' : 'countries'}
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
            >
              {favoriteCountries.map((country) => (
                <motion.div 
                  key={country.cca3} 
                  variants={itemVariants} 
                  className="relative bg-white/5 rounded-xl overflow-hidden border border-white/10 h-full"
                >
                  {/* Remove Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(country.cca3);
                    }}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 text-red-500 hover:bg-white transition-colors duration-200 shadow-lg"
                    aria-label="Remove from favorites"
                  >
                    <BsHeartFill className="text-lg" />
                  </button>
                  
                  <Link to={`/country/${country.cca3}`} className="block h-full">
                    <TiltedCard
                      imageSrc={country.flags?.png || country.flags?.svg}
                      altText={`Flag of ${country.name.common}`}
                      captionText={country.name.common}
                      containerHeight="280px"
                      containerWidth="100%"
                      imageHeight="100%"
                      imageWidth="100%"
                      rotateAmplitude={10}
                      scaleOnHover={1.02}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={true}
                      overlayContent={
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                          <h3 className="text-lg font-bold text-white mb-1">
                            {country.name.common}
                          </h3>
                          <div className="flex items-center text-white/90 text-sm">
                            <span className="mr-2">{country.region}</span>
                            {country.capital && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{country.capital[0]}</span>
                              </>
                            )}
                          </div>
                        </div>
                      }
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm"
            >
              <div className="inline-block p-6 border border-white/20 rounded-full mb-6">
                <BsGlobe className="text-6xl text-white" />
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