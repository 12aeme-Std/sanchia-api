import { Router } from 'express';
import { UserController } from './user.controller';
import passport from 'passport';

const router = Router();
const userController = new UserController();

router.post('/', userController.register.bind(userController));

router.get('/', userController.findAll.bind(userController));
router.get('/:id', userController.findOne.bind(userController));

router.use(passport.authenticate('jwt', { session: false }));

router.patch('/:id', userController.update.bind(userController));

router.delete('/:id', userController.delete.bind(userController));

export default router;
