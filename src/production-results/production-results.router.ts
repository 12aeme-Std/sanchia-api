import { Router } from 'express';
import { ProductionResultsController } from './production-results.controller';

const router = Router();
const productionResultsController = new ProductionResultsController();

// router.use(passport.authenticate('jwt', { session: false }));
router.patch(
    '/:id/status',
    productionResultsController.setResultAsSync.bind(
        productionResultsController
    )
);

export default router;
