export interface CreateMixtureDto {
    recipeId: number;
    name: string;
    materials: Array<{
        rawMaterialId: number;
        quantity: number;
    }>;
}
