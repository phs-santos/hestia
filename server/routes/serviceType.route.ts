import express from 'express';
import * as controller from '../controllers/serviceTypeController';
import roleMiddleware from '../middleware/roleMiddleware';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/service-type', authMiddleware, roleMiddleware(['*']), controller.create);
router.get('/service-type', authMiddleware, roleMiddleware(['*']), controller.getAll);
router.get('/service-type/:id', authMiddleware, roleMiddleware(['*']), controller.getById);
router.patch('/service-type/:id', authMiddleware, roleMiddleware(['*']), controller.update);
router.delete('/service-type/:id', authMiddleware, roleMiddleware(['*']), controller.remove);

export default router;
