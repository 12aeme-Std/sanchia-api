import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { verifyToken } from '../utilities/middlewares';

const router = Router();
const userController = new UserController();

// Missing get an specific user
router.post('/', userController.signUp.bind(userController));
router.post('/signin', userController.signIn.bind(userController));
router.post('/signout', userController.signOut.bind(userController));

router.get('/', verifyToken, userController.getUsers.bind(userController));

router.patch('/:id', verifyToken, userController.updateUser.bind(userController));

router.delete('/:id', verifyToken, userController.deleteUser.bind(userController));

export default router;
