import { MixtureDto } from './mixture.dtos';

export interface MixtureResultDto {
    id: number;
    mixtureId: number;
    quantity: number;
    finishedAt: Date;
    mixture: MixtureDto;
}
