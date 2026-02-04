import express from 'express';
const router = express.Router();

router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import authRoutes from './auth.routes';
import usersRoutes from './user.routes';
import logsRoutes from './log.routes';

router.use(authRoutes);
router.use(usersRoutes);
router.use(logsRoutes);

export default router;
