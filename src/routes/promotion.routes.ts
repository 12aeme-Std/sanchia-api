import { Router } from 'express';
import { verifyToken } from '../utilities/middlewares';
import PromotionController from '../controllers/promotion.controller';

const router = Router();
const promotionController = new PromotionController();

router.post('/', verifyToken, promotionController.createPromotion.bind(promotionController));

router.get('/', verifyToken, promotionController.getPromotions.bind(promotionController));
router.get('/:id', verifyToken, promotionController.getPromotionById.bind(promotionController));

router.patch('/:id', verifyToken, promotionController.updatePromotion.bind(promotionController));
        
router.delete('/:id', verifyToken, promotionController.deletePromotion.bind(promotionController));

export default router;
