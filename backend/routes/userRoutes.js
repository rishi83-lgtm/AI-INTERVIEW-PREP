import {Router} from 'express';import {authMiddleware} from '../middleware/authMiddleware.js';import {updateProfile,updateSettings} from '../controllers/userController.js';
const router=Router();router.use(authMiddleware);router.put('/profile',updateProfile);router.put('/settings',updateSettings);export default router;
