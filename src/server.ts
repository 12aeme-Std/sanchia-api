import express, { type Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import cartRouter from './cart/cart.routes';
import categoryRouter from './category/category.routes';
import clientRouter from './client/client.routes';
import orderRouter from './order/order.routes';
import productRouter from './product/product.routes';
import userRouter from './user/user.routes';
import promotionRouter from './promo/promotion.routes';
import preOrderRoutes from './preorder/preorder.routes';

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
