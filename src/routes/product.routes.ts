import { Router } from 'express';
import productController from '../controllers/product.controller';
import { verifyToken, upload } from '../utilities/middlewares';

class ProductRouter {
    public router: Router = Router();

    constructor() {
        this.getProductById();
        this.getProducts();
        this.createProduct();
        this.updateProduct();
    }

    public getProductById = () => {
        this.router.get('/:productId', productController.getProductById);
    };

    public getProducts = () => {
        this.router.get('/', productController.getProducts);
    };

    public createProduct = () => {
        this.router.post(
            '/',
            upload.array('images'),
            verifyToken,
            productController.createProduct
        );
    };

    public updateProduct = () => {
        this.router.put(
            '/:productId',
            verifyToken,
            productController.updateProduct
        );
    };

    public deleteProduct = () => {
        this.router.delete(
            '/:productId',
            verifyToken,
            productController.deleteProduct
        );
    };
}

const productRouter = new ProductRouter();
export default productRouter.router;
