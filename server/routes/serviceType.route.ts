import express from 'express';
import * as controller from '../controllers/serviceTypeController';
import roleMiddleware from '../middleware/roleMiddleware';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/service-types', authMiddleware, roleMiddleware(['*']), controller.create);
router.get('/service-types', authMiddleware, roleMiddleware(['*']), controller.getAll);
router.get('/service-types/:id', authMiddleware, roleMiddleware(['*']), controller.getById);
router.patch('/service-types/:id', authMiddleware, roleMiddleware(['*']), controller.update);
router.delete('/service-types/:id', authMiddleware, roleMiddleware(['*']), controller.remove);

export default router;
