import { Prisma } from '@prisma/client';

export type CreateRecipeDto = {
    materials: Array<{
        materialId: number;
        quantity: number;
    }>;
} & Omit<Prisma.RecipeCreateInput, 'materials'>;
