import { Router } from 'express';
import * as featureController from '../controllers/featureController';
import authenticate from '../middleware/authMiddleware';

const router = Router();

router.get('/', featureController.getAllFeatures);
router.post('/', authenticate, featureController.createFeature);
router.get('/:code', authenticate, featureController.getFeatureByCode);
router.patch('/:code', authenticate, featureController.updateFeature);
router.delete('/:code', authenticate, featureController.removeFeature);

router.post('/subfeatures', authenticate, featureController.createSubfeature);
router.delete('/subfeatures/:code', authenticate, featureController.removeSubfeature);

export default router;
