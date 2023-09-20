import { CategoryDto } from '@category/dtos/category.dto';

export interface ProductDto {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category?: CategoryDto;
    images?: string[];
}
