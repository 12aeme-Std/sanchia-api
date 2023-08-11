export interface CreateManufactureResultDto {
    manufactureId: number;
    quantity: number;
    finishedAt: Date | string;
    waste?: string;
    wasteQuantity?: number;
    productResultName: string;
    productResultQuantity: number;
    burr?: string;
    burrQuantity?: number;
}
