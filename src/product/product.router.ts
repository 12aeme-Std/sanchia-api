import { Router } from 'express';
import { ProductController } from './product.controller';
import passport from 'passport';
import upload from '../middlewares/multer.mid';

const router = Router();
const productController = new ProductController();

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', upload, productController.create.bind(productController));

router.get('/:id', productController.findOne.bind(productController));
router.get('/', productController.findAll.bind(productController));

router.patch('/:id', productController.update.bind(productController));

router.delete('/:id', productController.delete.bind(productController));

export default router;
