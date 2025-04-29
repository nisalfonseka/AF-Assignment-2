import express from 'express';
import { 
  getAllCountries, 
  getCountriesByName, 
  getCountriesByRegion, 
  getCountryByCode 
} from '../controllers/countryController.js';

const router = express.Router();

// Define routes
router.get('/countries', getAllCountries);
router.get('/countries/name/:name', getCountriesByName);
router.get('/countries/region/:region', getCountriesByRegion);
router.get('/countries/code/:code', getCountryByCode);

export default router;