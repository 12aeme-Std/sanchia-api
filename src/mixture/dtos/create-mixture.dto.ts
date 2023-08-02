export interface CreateMixtureDto {
    name: string;

    mixtureMachineId: number;
    recipeId: number;

    materials: Array<{
        rawMaterialId: number;
        quantity: number;
    }>;
}
