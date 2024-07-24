import { Router } from 'express';
import { ProductionResultsController } from './production-results.controller';

const router = Router();
const productionResultsController = new ProductionResultsController();

// router.use(passport.authenticate('jwt', { session: false }));
router.get(
    '/',
    productionResultsController.methodX.bind(productionResultsController)
);

export default router;
