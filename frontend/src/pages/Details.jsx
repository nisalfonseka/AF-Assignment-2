import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Spinner from '../components/Spinner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import Waves from '../components/Waves';
import { useSnackbar } from 'notistack';
import { BsGeoAlt, BsPeople, BsGlobe, BsClock, BsCashCoin, BsTranslate, BsMap, BsHeartFill, BsHeart } from 'react-icons/bs';
import { FaRegBuilding, FaLandmark, FaExternalLinkAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Details = () => {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { code } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const containerRef = useRef(null);
  const { user, syncFavorites, isAuthenticated } = useAuth();

  // Check if country is in favorites
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteCountries');
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    setIsFavorite(favorites.includes(code));
  }, [code]);

  // Fetch country data
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/api/countries/code/${code}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setCountry(response.data[0]);
        } else {
          enqueueSnackbar('Country data not found', { variant: 'error' });
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error fetching country details:', error);
        const message = error.response?.data?.message || 'Failed to fetch country details';
        enqueueSnackbar(message, { variant: 'error' });
      });
  }, [code, enqueueSnackbar]);

  // Toggle favorite status
  const toggleFavorite = () => {
    const savedFavorites = localStorage.getItem('favoriteCountries');
    let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    if (isFavorite) {
      favorites = favorites.filter(item => item !== code);
      enqueueSnackbar('Removed from favorites', { variant: 'info' });
    } else {
      favorites.push(code);
      enqueueSnackbar('Added to favorites', { variant: 'success' });
    }
    
    localStorage.setItem('favoriteCountries', JSON.stringify(favorites));
    
    // Sync with server for logged-in users
    if (isAuthenticated) {
      syncFavorites(favorites);
    }
    
    setIsFavorite(!isFavorite);
  };

  const formatNumber = (num) => {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'N/A';
  };

  const getLanguages = (languages) => {
    return languages ? Object.values(languages).join(', ') : 'N/A';
  };

  const getCurrencies = (currencies) => {
    return currencies ? Object.values(currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ') : 'N/A';
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

      <div className="relative z-10 flex flex-col min-h-screen">
     
        
        <main className="container mx-auto p-4 flex-grow" ref={containerRef}>
          <div className="mb-6 flex justify-between items-center">
            <BackButton />
            
            {country && (
              <motion.button
                onClick={toggleFavorite}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/10 text-white border border-white/20'
                }`}
              >
                {isFavorite ? 
                  <><BsHeartFill className="text-lg" /> Favorited</> : 
                  <><BsHeart className="text-lg" /> Add to Favorites</>
                }
              </motion.button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : country ? (
            <div className="space-y-10">
              {/* Hero Section */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeInUpVariants}
                transition={{ duration: 0.5 }}
                className="relative h-80 md:h-96 rounded-3xl overflow-hidden"
              >
                <img
                  src={country.flags?.svg || country.flags?.png}
                  alt={`Flag of ${country.name.common}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end">
                    <div>
                      <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                        {country.name.common}
                      </h1>
                      <p className="text-xl text-gray-200">{country.name.official}</p>
                    </div>
                    
                    {country.coatOfArms?.svg && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="hidden md:block"
                      >
                        <img
                          src={country.coatOfArms.svg}
                          alt="Coat of Arms"
                          className="h-20 w-20 md:h-28 md:w-28 bg-white/10 p-2 rounded-2xl backdrop-blur-sm"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Key Info Cards */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeInUpVariants}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
              >
                <KeyInfoCard 
                  icon={<FaLandmark className="text-[#17E9E0]" />}
                  label="Capital"
                  value={country.capital ? country.capital.join(', ') : 'N/A'}
                />
                
                <KeyInfoCard 
                  icon={<BsGlobe className="text-[#FCCD04]" />}
                  label="Region"
                  value={country.region || 'N/A'}
                />
                
                <KeyInfoCard 
                  icon={<BsPeople className="text-[#A64AC9]" />}
                  label="Population"
                  value={formatNumber(country.population)}
                />
                
                <KeyInfoCard 
                  icon={<BsGeoAlt className="text-[#FF7EB9]" />}
                  label="Area"
                  value={`${formatNumber(country.area)} km²`}
                />
              </motion.div>

              {/* Detail Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUpVariants}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <DetailCard 
                    icon={<FaLandmark />} 
                    title="Basic Information"
                    color="#17E9E0"
                  >
                    <DetailItem label="Official Name" value={country.name.official} />
                    <DetailItem label="Subregion" value={country.subregion || 'N/A'} />
                    <DetailItem label="Independent" value={country.independent ? 'Yes' : 'No'} />
                    <DetailItem label="UN Member" value={country.unMember ? 'Yes' : 'No'} />
                    <DetailItem label="Status" value={country.status || 'N/A'} />
                  </DetailCard>
                </motion.div>
                
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUpVariants}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <DetailCard 
                    icon={<BsGeoAlt />} 
                    title="Geography"
                    color="#FCCD04"
                  >
                    <DetailItem label="Landlocked" value={country.landlocked ? 'Yes' : 'No'} />
                    <DetailItem label="Borders" value={country.borders ? country.borders.join(', ') : 'None'} />
                    <DetailItem label="Timezones" value={country.timezones ? country.timezones.join(', ') : 'N/A'} />
                    {country.latlng && (
                      <DetailItem 
                        label="Coordinates" 
                        value={`${country.latlng[0].toFixed(2)}, ${country.latlng[1].toFixed(2)}`} 
                      />
                    )}
                  </DetailCard>
                </motion.div>
                
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUpVariants}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <DetailCard 
                    icon={<BsPeople />} 
                    title="Demographics"
                    color="#A64AC9"
                  >
                    <DetailItem label="Male Demonym" value={country.demonyms?.eng?.m || 'N/A'} />
                    <DetailItem label="Female Demonym" value={country.demonyms?.eng?.f || 'N/A'} />
                    {country.gini && (
                      <DetailItem 
                        label="GINI Index" 
                        value={`${Object.values(country.gini)[0]} (${Object.keys(country.gini)[0]}))`} 
                      />
                    )}
                  </DetailCard>
                </motion.div>
                
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUpVariants}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <DetailCard 
                    icon={<BsTranslate />} 
                    title="Language & Currency"
                    color="#FF7EB9"
                  >
                    <DetailItem label="Languages" value={getLanguages(country.languages)} />
                    <DetailItem label="Currencies" value={getCurrencies(country.currencies)} />
                    <DetailItem label="TLDs" value={country.tld?.join(', ') || 'N/A'} />
                  </DetailCard>
                </motion.div>
                
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUpVariants}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <DetailCard 
                    icon={<BsClock />} 
                    title="Miscellaneous"
                    color="#7AFCFF"
                  >
                    <DetailItem label="Car Sign" value={country.car?.signs?.join(', ') || 'N/A'} />
                    <DetailItem label="Driving Side" value={country.car?.side || 'N/A'} />
                    <DetailItem label="Start of Week" value={country.startOfWeek || 'N/A'} />
                  </DetailCard>
                </motion.div>
                
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUpVariants}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex items-stretch"
                >
                  <a
                    href={country.maps?.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-br from-[#17E9E0]/20 to-[#A64AC9]/20 rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center gap-4 hover:from-[#17E9E0]/30 hover:to-[#A64AC9]/30 transition-all duration-300"
                  >
                    <BsMap className="text-6xl text-[#17E9E0]" />
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">View on Google Maps</h3>
                      <p className="flex items-center justify-center gap-1 text-gray-300">
                        Open in new tab <FaExternalLinkAlt className="ml-1 text-sm" />
                      </p>
                    </div>
                  </a>
                </motion.div>
              </div>

              {/* Neighboring Countries - if available */}
              {country.borders && country.borders.length > 0 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUpVariants}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="mt-10"
                >
                  <h2 className="text-2xl font-bold mb-5 text-white">Neighboring Countries</h2>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {country.borders.map(borderCode => (
                      <Link 
                        key={borderCode} 
                        to={`/country/${borderCode}`}
                        className="min-w-[120px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 text-center transition-colors duration-300"
                      >
                        <div className="font-medium">{borderCode}</div>
                        <div className="text-xs text-gray-400 mt-1">View details</div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-white/5 border border-white/10 rounded-full p-8 mb-6">
                <BsGlobe className="text-7xl text-white/70" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Country Not Found</h2>
              <p className="text-gray-400 mb-6">We couldn't find information about this country</p>
              <Link
                to="/"
                className="bg-gradient-to-r from-[#A64AC9] to-[#17E9E0] text-white px-6 py-3 rounded-lg hover:from-[#8A39A6] hover:to-[#17E9E0] transition-all duration-300"
              >
                Back to All Countries
              </Link>
            </div>
          )}
        </main>
        
     
      </div>
    </div>
  );
};

// Key Info Card component (for the top summary row)
const KeyInfoCard = ({ icon, label, value }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-2xl">{icon}</div>
      <div className="text-sm text-gray-300">{label}</div>
    </div>
    <div className="text-xl font-bold text-white">{value}</div>
  </div>
);

// Detail Item component
const DetailItem = ({ label, value }) => (
  <div className="py-2 border-b border-white/10 group hover:bg-white/5 -mx-4 px-4 transition-colors last:border-b-0">
    <div className="flex justify-between items-center flex-wrap gap-2">
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="text-white font-medium text-right">{value}</div>
    </div>
  </div>
);

// Detail Card component
const DetailCard = ({ icon, title, children, color }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col">
    <div className="p-4 border-b border-white/10 flex items-center gap-3" style={{ backgroundColor: `${color}15` }}>
      <span className="text-2xl" style={{ color }}>{icon}</span>
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
    <div className="p-4 flex-grow">
      {children}
    </div>
  </div>
);

export default Details;