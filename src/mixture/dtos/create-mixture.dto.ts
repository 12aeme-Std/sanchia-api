export interface CreateMixtureDto {
    mixtureMachineId: number;
    recipeId: number;
    name: string;
    materials: Array<{
        rawMaterialId: number;
        quantity: number;
    }>;
}
