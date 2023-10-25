import { ProductOnCartDto } from '@cart/dtos/product-on-cart.dto';

export interface OrderDto {
    id: number;
    userId: number;
    total: number;

    items: ProductOnCartDto[];
}
