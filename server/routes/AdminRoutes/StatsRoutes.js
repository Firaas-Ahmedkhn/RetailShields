import express from 'express';
import { getAdminStats ,getPOSActivityDistribution} from '../../controllers/AdminControllers/statsController.js';

const router = express.Router();

router.get('/', getAdminStats);
router.get('/actstats',getPOSActivityDistribution)

export default router;
