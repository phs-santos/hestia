import express from 'express';
import * as controller from '../controllers/serviceConfigController';
import roleMiddleware from '../middleware/roleMiddleware';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/service-config', authMiddleware, roleMiddleware(['*']), controller.create);
router.get('/service-config', authMiddleware, roleMiddleware(['*']), controller.getAll);
router.get('/service-config/:id', authMiddleware, roleMiddleware(['*']), controller.getById);
router.patch('/service-config/:id', authMiddleware, roleMiddleware(['*']), controller.update);
router.delete('/service-config/:id', authMiddleware, roleMiddleware(['*']), controller.remove);

export default router;
