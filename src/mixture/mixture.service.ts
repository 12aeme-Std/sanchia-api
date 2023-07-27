import { Prisma, PrismaClient } from '@prisma/client';
import { MixtureDto } from './dtos/mixture.dtos';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { RawMaterialService } from '@raw-material/raw-material.service';
import { CreateMixtureDto } from './dtos/create-mixture.dto';

export class MixtureService {
    private readonly prisma: PrismaClient;
    private readonly rawMaterialService: RawMaterialService;

    constructor() {
        this.prisma = new PrismaClient();
        this.rawMaterialService = new RawMaterialService();
    }

    // TODO: Connect with recipes
    // TODO: Check raw material to allow this method
    // async create(data: CreateMixtureDto): Promise<MixtureDto> {
    //     return await this.prisma.$transaction(async (tx) => {
    //         await tx.mixture.findUniqueOrThrow({
    //             where: {
    //                 name: data.name,
    //             },
    //         });

    //         const mixture = await tx.mixture.create({ data });

    //         await Promise.all(
    //             data.materials.map(async ({ rawMaterialId: id, quantity }) => {
    //                 const rawMaterialQuantity =
    //                     await tx.rawMaterial.findUniqueOrThrow({
    //                         where: { id },
    //                     });

    //                 return rawMaterialQuantity.stock >= quantity;
    //             })
    //         );

    //         await Promise.all(
    //             data.materials.map(({ rawMaterialId, quantity }) =>
    //                 tx.mixtureMaterial.create({
    //                     data: {
    //                         mixture: {
    //                             connect: {
    //                                 id: mixture.id,
    //                             },
    //                         },
    //                         rawMaterial: {
    //                             connect: {
    //                                 id: rawMaterialId,
    //                             },
    //                         },
    //                         quantity,
    //                     },
    //                 })
    //             )
    //         );
    //     });
    // }

    async findOne(where: Prisma.MixtureWhereUniqueInput): Promise<MixtureDto> {
        return this.prisma.mixture.findUniqueOrThrow({ where }).catch(() => {
            throw new HttpError(404, 'Mixture does not exists');
        });
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.MixtureWhereUniqueInput;
            where?: Prisma.MixtureWhereInput;
            orderBy?: Prisma.MixtureOrderByWithAggregationInput;
        }
    ): Promise<MixtureDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return this.prisma.mixture.findMany({
            skip: page! - 1,
            take: limit,
            cursor,
            where,
            orderBy,
        });
    }

    async update(
        id: number,
        data: Prisma.MixtureUpdateInput
    ): Promise<MixtureDto> {
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Mixture does not exists');

        return this.prisma.mixture.update({
            data,
            where: { id },
        });
    }

    async delete(id: number): Promise<void> {
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Mixture does not exists');

        await this.prisma.mixture.delete({ where: { id } });
    }

    private async exists(where: Prisma.MixtureWhereUniqueInput) {
        return (await this.prisma.mixture.findUnique({ where })) !== null;
    }
}
