import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateFavorites,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/favorites', protect, updateFavorites);

export default router;