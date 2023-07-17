import { Router } from 'express';
import { verifyToken } from '../utilities/middlewares';
import ClientController from '../controllers/client.controller';

const router = Router();
const clientController = new ClientController();

// TODO: Is this really needed? We just need passport auth
router.post('/', clientController.clientSignUp.bind(clientController));
router.post('/signin', clientController.clientSignIn.bind(clientController));
router.post('/singout/:id', clientController.clientSignOut.bind(clientController));

// TODO: Probably we're missing get by id or similar
router.get('/', verifyToken, clientController.getClients.bind(clientController));

router.patch('/:id', clientController.updateClient.bind(clientController));

router.delete('/:id', clientController.deleteClient.bind(clientController));

export default router;
