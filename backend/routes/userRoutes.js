import express from 'express';
const router = express.Router();
import { authUser, registerUser,logoutUser,getUsers,getUserByID,getUserProfile, updateUserProfile, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddlerware.js'

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/logout', logoutUser);
router.post('/auth', authUser);
router.route('/profile').put(protect, updateUserProfile).get(protect, getUserProfile);
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserByID).put(protect, admin, updateUser);

export default router;