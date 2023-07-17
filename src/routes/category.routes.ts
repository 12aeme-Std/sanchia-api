import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import { verifyToken } from '../utilities/middlewares';

class CategoryRouter {
    public router: Router = Router();

    constructor() {
        this.getCategoryById();
        this.getCategories();
        this.createCategory();
        this.updateCategory();
        this.deleteCategory();
    }

    public getCategoryById = () => {
        this.router.get('/:categoryId', categoryController.getCategoryById);
    };

    public getCategories = () => {
        this.router.get('/', categoryController.getCategories);
    };

    public createCategory = () => {
        this.router.post('/', verifyToken, categoryController.createCategory);
    };

    public updateCategory = () => {
        this.router.put(
            '/:categoryId',
            verifyToken,
            categoryController.updateCategory
        );
    };

    public deleteCategory = () => {
        this.router.put(
            '/:categoryId',
            verifyToken,
            categoryController.deleteCategory
        );
    };
}

const categoryRouter = new CategoryRouter();
export default categoryRouter.router;
