import { Router } from 'express';
import passport from 'passport';
import { CategoryController } from './category.controller';

const router = Router();
const categoryController = new CategoryController();

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', categoryController.create.bind(categoryController));

router.get('/:id', categoryController.findOne.bind(categoryController));
router.get('/', categoryController.findAll.bind(categoryController));

router.patch('/:id', categoryController.update.bind(categoryController));

router.delete('/:id', categoryController.delete.bind(categoryController));

export default router;
