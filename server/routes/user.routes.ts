import express from 'express';
import * as controller from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/users', authMiddleware, controller.getAll);
router.get('/users/:id', authMiddleware, controller.getById);
router.patch('/users/:id', authMiddleware, roleMiddleware(['ADMIN', 'ROOT']), controller.update);
router.delete('/users/:id', authMiddleware, roleMiddleware(['ROOT']), controller.remove);

export default router;
