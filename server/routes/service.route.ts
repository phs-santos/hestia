import express from 'express';
import * as controller from '../controllers/serviceController';
import roleMiddleware from '../middleware/roleMiddleware';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/services', authMiddleware, roleMiddleware(['*']), controller.create);
router.get('/services', authMiddleware, roleMiddleware(['*']), controller.getAll);
router.get('/services/:id', authMiddleware, roleMiddleware(['*']), controller.getById);
router.patch('/services/:id', authMiddleware, roleMiddleware(['*']), controller.update);
router.delete('/services/:id', authMiddleware, roleMiddleware(['*']), controller.remove);

export default router;
