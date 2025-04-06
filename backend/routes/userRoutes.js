import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/register', upload.single('profileImage'), registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

export default router;