import { Context, MockContext, createMockContext } from '@tests/context';
import { MixtureService } from './mixture.service';
import { allMixturesMock, mixtureMock } from '@tests/mocks/mixture.mock';

let mockCtx: MockContext;
let ctx: Context;

describe('MixtureService', () => {
    let mixtureService: MixtureService;

    beforeEach(() => {
        mockCtx = createMockContext();
        ctx = mockCtx as unknown as Context;

        mixtureService = new MixtureService(ctx.prisma);
    });

    it('should be defined', () => {
        expect(ctx).toBeDefined();
    });

    describe('findOne', () => {
        it('should findOne mixture', async () => {
            mockCtx.prisma.mixture.findUniqueOrThrow.mockResolvedValueOnce(
                mixtureMock
            );

            const result = await mixtureService.findOne({ id: 1 });

            expect(result).toEqual(mixtureMock);
        });

        it('should fail when mixture does not exists', async () => {
            mockCtx.prisma.mixture.findUniqueOrThrow.mockRejectedValueOnce(
                null
            );

            await expect(mixtureService.findOne({ id: 1000 })).rejects.toThrow(
                'Mixture does not exists'
            );
        });
    });

    describe('findAll', () => {
        it('should find all mixtures', async () => {
            mockCtx.prisma.mixture.findMany.mockResolvedValue(allMixturesMock);

            const page = 1;
            const limit = 15;

            const result = await mixtureService.findAll({ page, limit });

            expect(result).toHaveLength(3);
            expect(result).toMatchObject(allMixturesMock);
            expect(mockCtx.prisma.mixture.findMany).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('should update a mixture', async () => {
            mockCtx.prisma.mixture.findUniqueOrThrow.mockResolvedValueOnce(
                mixtureMock
            );
            mockCtx.prisma.mixture.update.mockResolvedValue({
                ...mixtureMock,
                name: 'updated',
            });

            const result = await mixtureService.update(1, {
                name: 'updated',
            });

            expect(result.name).toEqual('updated');
        });
    });

    describe('delete', () => {
        it('should delete a mixture', async () => {
            mockCtx.prisma.mixture.findUniqueOrThrow.mockResolvedValueOnce(
                mixtureMock
            );
            mockCtx.prisma.mixture.delete.mockResolvedValue(mixtureMock);

            await mixtureService.delete(mixtureMock.id);

            expect(mockCtx.prisma.mixture.delete).toHaveBeenCalled();
        });
    });
});
