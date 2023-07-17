import { Router } from 'express';
import clienController from '../controllers/client.controller';
import { verifyToken } from '../utilities/middlewares';

class ClientRouter {
    public router: Router = Router();

    constructor() {
        this.clientSignUp();
        this.clientSignIn();
        this.clientSignOut();
        this.getClients();
        this.deleteClient();
        this.updateClient();
    }

    public clientSignUp = () => {
        this.router.post('/', clienController.clientSignUp);
    };

    public clientSignIn = () => {
        this.router.post('/signin', clienController.clientSignIn);
    };

    public clientSignOut = () => {
        this.router.post('/out/:clientId', clienController.clientSignOut);
    };

    public getClients = () => {
        this.router.get('/', verifyToken, clienController.getClients);
    };

    public deleteClient = () => {
        this.router.delete(
            '/:clientId',
            verifyToken,
            clienController.deleteClient
        );
    };

    public updateClient = () => {
        this.router.put(
            '/:clientId',
            verifyToken,
            clienController.updateClient
        );
    };
}

const clientRouter = new ClientRouter();
export default clientRouter.router;
