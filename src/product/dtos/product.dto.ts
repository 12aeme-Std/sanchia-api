import { CategoryDto } from '@category/dtos/category.dto';
import { ProductDimentionsDto } from './product-dimentions.dto';

export interface ProductDto {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category?: CategoryDto;
    // productDimentions: ProductDimentionsDto | undefined;
    images?: string[];
}
