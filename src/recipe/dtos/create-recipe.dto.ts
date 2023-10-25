import { RecipeType } from '@prisma/client';
export interface CreateRecipeDto {
    name: string;
    description: string;
    quantity: number;
    type: RecipeType;
    manufactureProductId: number;
    materials: Array<{
        id: number;
        quantity: number;
    }>;
}
