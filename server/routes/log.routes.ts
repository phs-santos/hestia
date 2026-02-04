import express from 'express';
import * as logController from '../controllers/logController';
import roleMiddleware from '../middleware/roleMiddleware';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.get('/logs', authMiddleware, roleMiddleware(['ROOT']), logController.getAll);

export default router;
