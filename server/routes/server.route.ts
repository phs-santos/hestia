import express from 'express';
import * as controller from '../controllers/serverController';
import roleMiddleware from '../middleware/roleMiddleware';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/servers', authMiddleware, roleMiddleware(['*']), controller.create);
router.get('/servers', authMiddleware, roleMiddleware(['*']), controller.getAll);
router.get('/servers/:id', authMiddleware, roleMiddleware(['*']), controller.getById);
router.patch('/servers/:id', authMiddleware, roleMiddleware(['*']), controller.update);
router.delete('/servers/:id', authMiddleware, roleMiddleware(['*']), controller.remove);

export default router;
