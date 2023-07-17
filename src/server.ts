import express, { type Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import cartRouter from './routes/cart.routes';
import categoryRouter from './routes/category.routes';
import clientRouter from './routes/client.routes';
import orderRouter from './routes/order.routes';
import productRouter from './routes/product.routes';
import userRouter from './routes/user.routes';
import promotionRouter from './routes/promotion.routes';
import preOrderRoutes from './routes/preorder.routes';

class Server {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
    }

    routes(): void {
        this.app.use('/user', userRouter);
        this.app.use('/product', productRouter);
        this.app.use('/order', orderRouter);
        this.app.use('/client', clientRouter);
        this.app.use('/category', categoryRouter);
        this.app.use('/cart', cartRouter);
        this.app.use('/promo', promotionRouter);
        this.app.use('/preorder', preOrderRoutes);
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port ' + this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();
