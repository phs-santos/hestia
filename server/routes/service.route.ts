import express from 'express';
import * as controller from '../controllers/serviceController';
import roleMiddleware from '../middleware/roleMiddleware';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/service', authMiddleware, roleMiddleware(['*']), controller.create);
router.get('/service', authMiddleware, roleMiddleware(['*']), controller.getAll);
router.get('/service/:id', authMiddleware, roleMiddleware(['*']), controller.getById);
router.patch('/service/:id', authMiddleware, roleMiddleware(['*']), controller.update);
router.delete('/service/:id', authMiddleware, roleMiddleware(['*']), controller.remove);

export default router;
