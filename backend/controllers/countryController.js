import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1';

// Get all countries
export const getAllCountries = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/all`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching countries', error: error.message });
  }
};

// Search countries by name
export const getCountriesByName = async (req, res) => {
  try {
    const { name } = req.params;
    const response = await axios.get(`${BASE_URL}/name/${name}`);
    res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'No countries found with that name' });
    }
    res.status(500).json({ message: 'Error searching countries', error: error.message });
  }
};

// Get countries by region
export const getCountriesByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    const response = await axios.get(`${BASE_URL}/region/${region}`);
    res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'No countries found in that region' });
    }
    res.status(500).json({ message: 'Error fetching countries by region', error: error.message });
  }
};

// Get country details by code
export const getCountryByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const response = await axios.get(`${BASE_URL}/alpha/${code}`);
    res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'Country not found with that code' });
    }
    res.status(500).json({ message: 'Error fetching country details', error: error.message });
  }
};