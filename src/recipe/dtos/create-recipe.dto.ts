export interface CreateRecipeDto {
    name: string;
    description: string;
    quantity: number;
    materials: Array<{
        id: number;
        quantity: number;
    }>;
}
