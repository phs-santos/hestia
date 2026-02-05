import express from 'express';
import * as authController from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/auth/register', authController.register);
router.post('/auth/login/email', authController.loginEmail);
router.post('/auth/login/nickname', authController.loginNickname);
router.post('/auth/sign-out', authController.signOut);
router.get('/auth/me', authMiddleware, authController.getMe);

export default router;
