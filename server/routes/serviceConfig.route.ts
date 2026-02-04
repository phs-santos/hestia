import express from 'express';
import * as controller from '../controllers/serviceConfigController';
import roleMiddleware from '../middleware/roleMiddleware';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/service-configs', authMiddleware, roleMiddleware(['*']), controller.create);
router.get('/service-configs', authMiddleware, roleMiddleware(['*']), controller.getAll);
router.get('/service-configs/:id', authMiddleware, roleMiddleware(['*']), controller.getById);
router.patch('/service-configs/:id', authMiddleware, roleMiddleware(['*']), controller.update);
router.delete('/service-configs/:id', authMiddleware, roleMiddleware(['*']), controller.remove);

export default router;
