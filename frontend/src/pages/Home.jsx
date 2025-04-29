import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { BsInfoCircle, BsSearch, BsGlobe, BsFilter, BsHeart, BsHeartFill } from 'react-icons/bs';
import { useSnackbar } from 'notistack';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import Waves from '../components/Waves';
// Replace TextPressure with ScrollVelocity
import ScrollVelocity from '../components/ScrollVelocity';
import TiltedCard from '../components/TiltedCard';


const Home = () => {
  // Add a state for velocity to control the scroll velocity
  const [velocity, setVelocity] = useState(30);

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [uniqueLanguages, setUniqueLanguages] = useState([]);
  const [uniqueRegions, setUniqueRegions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { user, syncFavorites, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState(() => {
    // If logged in, use user favorites, otherwise use localStorage
    if (user && user.favorites) {
      return user.favorites;
    } else {
      const savedFavorites = localStorage.getItem('favoriteCountries');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    }
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteCountries', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setLoading(true);
    // Fetching from backend API
    axios
      .get('http://localhost:5555/api/countries')
      .then((response) => {
        setCountries(response.data);

        // Extract unique regions
        const regions = [...new Set(response.data.map(country => country.region))].filter(Boolean).sort();
        setUniqueRegions(regions);

        // Extract unique languages
        const languagesMap = new Map();
        response.data.forEach(country => {
          if (country.languages) {
            Object.entries(country.languages).forEach(([code, name]) => {
              if (!languagesMap.has(code)) {
                languagesMap.set(code, name);
              }
            });
          }
        });
        // Sort languages by name
        const sortedLanguages = [...languagesMap.entries()]
          .map(([code, name]) => ({ code, name }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setUniqueLanguages(sortedLanguages);

        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
        enqueueSnackbar('Failed to fetch countries', { variant: 'error' });
        setLoading(false);
      });
  }, [enqueueSnackbar]);

  // Toggle favorite status for a country
  const toggleFavorite = useCallback((countryCode) => {
    setFavorites(prevFavorites => {
      let newFavorites;

      if (prevFavorites.includes(countryCode)) {
        enqueueSnackbar('Removed from favorites', { variant: 'info' });
        newFavorites = prevFavorites.filter(code => code !== countryCode);
      } else {
        enqueueSnackbar('Added to favorites', { variant: 'success' });
        newFavorites = [...prevFavorites, countryCode];
      }

      // Save to localStorage for non-logged-in users
      if (!isAuthenticated) {
        localStorage.setItem('favoriteCountries', JSON.stringify(newFavorites));
      } else {
        // Sync with server for logged-in users
        syncFavorites(newFavorites);
      }

      return newFavorites;
    });
  }, [enqueueSnackbar, isAuthenticated, syncFavorites]);

  // Filter countries based on search term, region and language
  const filteredCountries = countries.filter((country) => {
    const countryName = country.name?.common?.toLowerCase() || '';
    const countryRegion = country.region || '';
    const countryLanguages = country.languages ? Object.keys(country.languages) : [];

    const matchesSearch = countryName.includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === '' || countryRegion === filterRegion;
    const matchesLanguage = filterLanguage === '' || countryLanguages.includes(filterLanguage);

    return matchesSearch && matchesRegion && matchesLanguage;
  });

  const formatPopulation = (population) => {
    return population ? population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'N/A';
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      {/* Waves background in monochrome - fixed position */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Waves
          lineColor="rgba(255, 255, 255, 0.65)"
          backgroundColor="transparent"
          waveSpeedX={0.015}
          waveSpeedY={0.008}
          waveAmpX={45}
          waveAmpY={12}
          friction={0.92}
          tension={0.008}
          maxCursorMove={100}
          xGap={13}
          yGap={40}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        

        {/* Replace TextPressure with ScrollVelocity */}
        <div className="mb-9 relative">
          <ScrollVelocity
            texts={['Explore the World\'s Countries', 'Discover Amazing Places']}
            velocity={velocity}
            className="text-white font-bold"
            parallaxClassName="parallax"
            scrollerClassName="scroller custom-scroller"
            numCopies={4}
            parallaxStyle={{ marginTop: "2rem", marginBottom: "0rem" }}
            scrollerStyle={{ fontFamily: "Inter, system-ui, sans-serif" }}
          />
        </div>
        <main className="container mx-auto px-4 py-8 flex-grow relative z-10">
          <div className="rounded-xl p-8 mb-8">
            {/* Search and filter section */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <BsSearch className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for a country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 w-full bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50 focus:bg-white/10 text-white shadow-md"
                  />
                </div>

                <button
                  onClick={toggleFilters}
                  className="bg-white text-black py-3 px-5 rounded-md flex items-center justify-center gap-2 shadow-md transition-all duration-300 hover:bg-gray-200 font-medium"
                >
                  <BsFilter className="text-xl" />
                  Filters
                </button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white/5 rounded-md border border-white/20 backdrop-blur-sm animate-fadeIn">
                  <select
                    value={filterRegion}
                    onChange={(e) => setFilterRegion(e.target.value)}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-white/50"
                  >
                    <option value="">All Regions</option>
                    {uniqueRegions.map((region) => (
                      <option key={region} value={region} className="bg-black text-white">
                        {region}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-white/50"
                  >
                    <option value="">All Languages</option>
                    {uniqueLanguages.map((language) => (
                      <option key={language.code} value={language.code} className="bg-black text-white">
                        {language.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Results count */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <div className="px-4 py-2 bg-white/5 border border-white/20 rounded-full">
                <p className="text-white/80">
                  Showing <span className="font-bold text-white">{filteredCountries.length}</span> of <span className="font-bold text-white">{countries.length}</span> countries
                </p>
              </div>

              {(filterRegion !== '' || filterLanguage !== '' || searchTerm !== '') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterRegion('');
                    setFilterLanguage('');
                  }}
                  className="text-white underline hover:text-gray-300 transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>



            {loading ? (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredCountries.map((country) => {
                  const isFavorite = favorites.includes(country.cca3);
                  return (
                    <div key={country.cca3} className="relative">
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(country.cca3);
                        }}
                        className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-colors duration-200 ${isFavorite
                            ? 'bg-white/90 text-black'
                            : 'bg-black/60 text-white hover:bg-black/80'
                          }`}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {isFavorite ? (
                          <BsHeartFill className="text-lg" />
                        ) : (
                          <BsHeart className="text-lg" />
                        )}
                      </button>

                      <Link to={`/country/${country.cca3}`} className="block">
                        <TiltedCard
                          imageSrc={country.flags?.png || country.flags?.svg}
                          altText={`Flag of ${country.name.common}`}
                          captionText={country.name.common}
                          containerHeight="260px"
                          containerWidth="100%"
                          imageHeight="260px"
                          imageWidth="100%"
                          rotateAmplitude={15}
                          scaleOnHover={1.05}
                          showMobileWarning={false}
                          showTooltip={true}
                          displayOverlayContent={true}
                          overlayContent={
                            <div className="absolute bottom-0 left-0 right-0 p-4 ">
                              <h3 className="text-lg font-bold text-white">
                                {country.name.common}
                              </h3>
                            </div>
                          }
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}



            {!loading && filteredCountries.length === 0 && (
              <div className="text-center py-16 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm">
                <div className="inline-block p-6 border border-white/20 rounded-full mb-6">
                  <BsGlobe className="text-6xl text-white" />
                </div>
                <p className="text-white text-xl mb-6">No countries found matching your criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterRegion('');
                    setFilterLanguage('');
                  }}
                  className="bg-white text-black px-6 py-3 rounded-md hover:bg-gray-200 transition-all duration-300 font-medium"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </main>

        
      </div>
    </div>
  );
};

export default Home;