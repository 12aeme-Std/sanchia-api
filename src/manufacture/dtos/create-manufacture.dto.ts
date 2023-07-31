export interface CreateManufactureDto {
    name: string;
    manufactureMachineId: number;

    resources: Array<{
        mixtureResultId?: number;
        rawMaterialId?: number;
        quantity: number;
    }>;
}
