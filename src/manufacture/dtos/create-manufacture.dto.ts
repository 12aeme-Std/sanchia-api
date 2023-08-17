export interface CreateManufactureDto {
    name: string;
    manufactureMachineId: number;

    resources: Array<{
        mixtureResultId?: number;
        quantity: number;
    }>;
}
