import express from 'express';
const router = express.Router();

router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import authRoutes from './auth.routes';
import usersRoutes from './user.routes';
import logsRoutes from './log.routes';
import serverRoutes from './server.route';
import serviceRoutes from './service.route';
import serviceConfigRoutes from './serviceConfig.route';
import serviceTypeRoutes from './serviceType.route';

router.use(authRoutes);
router.use(usersRoutes);
router.use(logsRoutes);
router.use(serverRoutes);
router.use(serviceRoutes);
router.use(serviceConfigRoutes);
router.use(serviceTypeRoutes);

export default router;
