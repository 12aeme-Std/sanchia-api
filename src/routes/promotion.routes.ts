import { Router } from 'express';
import { verifyToken } from '../utilities/middlewares';
import promotionController from '../controllers/promotion.controller';

class PromotionRouter {
    public router: Router = Router();

    constructor() {
        this.createPromotion();
        this.getPromotions();
        this.getPromotionById();
        this.updatePromotion();
        this.deletePromotion();
    }

    public createPromotion = () => {
        this.router.post('/', verifyToken, promotionController.createPromotion);
    };

    public getPromotions = () => {
        this.router.get('/', verifyToken, promotionController.getPromotions);
    };

    public getPromotionById = () => {
        this.router.get(
            '/:promoId',
            verifyToken,
            promotionController.getPromotionById
        );
    };

    public updatePromotion = () => {
        this.router.put(
            '/:promoId',
            verifyToken,
            promotionController.updatePromotion
        );
    };

    public deletePromotion = () => {
        this.router.delete(
            '/:promoId',
            verifyToken,
            promotionController.deletePromotion
        );
    };
}

const promotionRouter = new PromotionRouter();
export default promotionRouter.router;
