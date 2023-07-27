import passport from 'passport';
import { Router } from 'express';
import { RawMaterialController } from './raw.material.controller';

const router = Router();
const rawMaterialController = new RawMaterialController();

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', rawMaterialController.create.bind(rawMaterialController));

router.get('/:id', rawMaterialController.findOne.bind(rawMaterialController));
router.get('/', rawMaterialController.findAll.bind(rawMaterialController));

router.patch('/:id', rawMaterialController.update.bind(rawMaterialController));

router.delete('/:id', rawMaterialController.delete.bind(rawMaterialController));

export default router;
