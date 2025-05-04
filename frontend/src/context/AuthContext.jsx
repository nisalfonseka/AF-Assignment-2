import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const API_URL = 'http://localhost:5555/api/users/';

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('worldExplorerUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}register`, {
        name,
        email,
        password,
      });

      if (response.data) {
        localStorage.setItem('worldExplorerUser', JSON.stringify(response.data));
        setUser(response.data);
        enqueueSnackbar('Registration successful!', { variant: 'success' });
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      enqueueSnackbar(message, { variant: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add setUserDirectly function
  const setUserDirectly = (userData) => {
    setUser(userData);
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}login`, {
        email,
        password,
      });

      if (response.data) {
        localStorage.setItem('worldExplorerUser', JSON.stringify(response.data));
        setUser(response.data);
        enqueueSnackbar('Login successful!', { variant: 'success' });
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid credentials';
      enqueueSnackbar(message, { variant: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('worldExplorerUser');
    localStorage.removeItem('favoriteCountries'); // Also clear favorites
    setUser(null);
    enqueueSnackbar('Logged out successfully', { variant: 'info' });
  };

  // Sync favorites with server
  // Update the syncFavorites function
const syncFavorites = async (favorites) => {
  if (!user) return;
  
  // Update local user data immediately regardless of backend success
  const updatedUser = { ...user, favorites };
  localStorage.setItem('worldExplorerUser', JSON.stringify(updatedUser));
  setUser(updatedUser);
  
  // Try to sync with backend if available
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    
    // Added timeout to prevent long waits for unavailable backend
    await axios.put(`${API_URL}favorites`, { favorites }, config, { timeout: 3000 });
  } catch (error) {
    console.log('Backend sync unavailable, using local storage only');
    // We don't show an error to the user since we've already updated local storage
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        syncFavorites,
        isAuthenticated: !!user,
        setUserDirectly
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};