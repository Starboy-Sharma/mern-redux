import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProflie,
  updateUserProflie,
} from '../controllers/userController.js';
const router = express.Router();

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(protect, getUserProflie)
  .put(protect, updateUserProflie);

export default router;
