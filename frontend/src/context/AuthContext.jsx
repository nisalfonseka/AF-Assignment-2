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
  const syncFavorites = async (favorites) => {
    if (!user) return;
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      await axios.put(`${API_URL}favorites`, { favorites }, config);
      
      // Update local user data
      const updatedUser = { ...user, favorites };
      localStorage.setItem('worldExplorerUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error syncing favorites:', error);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};