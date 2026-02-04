import express from 'express';
import * as userController from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/users', authMiddleware, userController.getAllUsers);
router.get('/users/:id', authMiddleware, userController.getUserById);
router.patch('/users/:id', authMiddleware, roleMiddleware(['ADMIN', 'ROOT']), userController.updateUser);
router.delete('/users/:id', authMiddleware, roleMiddleware(['ROOT']), userController.deleteUser);

export default router;
