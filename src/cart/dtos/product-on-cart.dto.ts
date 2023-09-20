import { ProductDto } from '@product/dtos/product.dto';

export interface SimpleProductOnCartDto {
    SKU: number;
    quantity: number;
}

export interface ProductOnCartDto {
    quantity: number;
    product: ProductDto;
}
