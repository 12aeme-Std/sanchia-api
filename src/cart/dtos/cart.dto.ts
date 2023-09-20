import { ProductOnCartDto } from './product-on-cart.dto';

export interface CartDto {
    id: number;
    userId: number;

    productsCarts: ProductOnCartDto[];
}
