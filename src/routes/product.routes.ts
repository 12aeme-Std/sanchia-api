import { Router } from 'express';
import { verifyToken, upload } from '../utilities/middlewares';
import ProductController from '../controllers/product.controller';

const router = Router();
const productController = new ProductController()

router.get('/', productController.getProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));


router.post('/', upload.array('images'), verifyToken, productController.createProduct.bind(productController));

router.patch('/:id', verifyToken, productController.updateProduct.bind(productController));

router.delete('/:id', verifyToken, productController.deleteProduct.bind(productController));

export default router;
