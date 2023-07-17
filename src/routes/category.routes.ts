import { Router } from 'express';
import CategoryController from '../controllers/category.controller';
import { verifyToken } from '../utilities/middlewares';

const router = Router();
const categoryController = new CategoryController;

router.post('/', verifyToken, categoryController.createCategory.bind(categoryController));

router.get('/', categoryController.getCategoryById.bind(categoryController));
router.get('/:id', categoryController.getCategories.bind(categoryController));

router.patch('/:id', verifyToken, categoryController.updateCategory.bind(categoryController));

router.delete('/:id', verifyToken, categoryController.deleteCategory.bind(categoryController));

export default router;
