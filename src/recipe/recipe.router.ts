import { Router } from 'express';
import { RecipeController } from './recipe.controller';
// import passport from 'passport';

const router = Router();
const recipeController = new RecipeController();

// router.use(passport.authenticate('jwt', { session: false }));

router.post('/', recipeController.create.bind(recipeController));
router.post('/:id', recipeController.createVariant.bind(recipeController));

router.get(
    '/manufacture-products/:mpId',
    recipeController.findByManufactureProduct.bind(recipeController)
);

router.get(
    '/:id/variants',
    recipeController.findAllVariants.bind(recipeController)
);
router.get('/:id', recipeController.findOne.bind(recipeController));
router.get('/', recipeController.findAll.bind(recipeController));

router.patch(
    '/:parentId/variant/:id',
    recipeController.updateVariant.bind(recipeController)
);
router.patch('/:id', recipeController.update.bind(recipeController));

router.delete('/:id', recipeController.delete.bind(recipeController));

export default router;
