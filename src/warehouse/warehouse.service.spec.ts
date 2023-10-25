import { Context, MockContext, createMockContext } from '@tests/context';
import { WarehouseService } from './warehouse.service';
import { allWarehoseMocks, warehouseMock } from '@tests/mocks/warehouse.mock';
import { WarehoseType } from '@prisma/client';

let mockCtx: MockContext;
let ctx: Context;

describe('ProductService', () => {
    let warehouseService: WarehouseService;

    beforeEach(() => {
        mockCtx = createMockContext();
        ctx = mockCtx as unknown as Context;

        warehouseService = new WarehouseService(ctx.prisma);
    });

    it('should be defined', () => {
        expect(ctx).toBeDefined();
    });

    describe('create', () => {
        it('should create a warehouse', async () => {
            const data = {
                name: 'WAREHOUSE_01',
                description: 'lorem ipsum dolor',
                type: WarehoseType.RAW_MATERIAL,
            };

            mockCtx.prisma.warehouse.findUnique.mockResolvedValue(null);
            mockCtx.prisma.warehouse.create.mockResolvedValue(warehouseMock);

            const result = await warehouseService.create(data);

            expect(result).toEqual(warehouseMock);
            expect(mockCtx.prisma.warehouse.create).toHaveBeenCalledWith({
                data,
            });
        });

        it('should throw a 409 when warehouse already exists', async () => {
            const data = {
                name: 'WAREHOUSE_01',
                description: 'lorem ipsum dolor',
                type: WarehoseType.RAW_MATERIAL,
            };

            mockCtx.prisma.warehouse.findUnique.mockResolvedValue(
                warehouseMock
            );

            await expect(warehouseService.create(data)).rejects.toThrow(
                'Warehouse already exists'
            );
        });
    });

    describe('findOne', () => {
        it('should findOne warehouse', async () => {
            mockCtx.prisma.warehouse.findUniqueOrThrow.mockResolvedValueOnce(
                warehouseMock
            );

            const result = await warehouseService.findOne({ id: 1 });

            expect(result).toEqual(warehouseMock);
        });

        it('should fail when warehouse does not exists', async () => {
            mockCtx.prisma.warehouse.findUniqueOrThrow.mockRejectedValueOnce(
                null
            );

            await expect(
                warehouseService.findOne({ id: 1000 })
            ).rejects.toThrow('Warehouse does not exists');
        });
    });

    describe('findAll', () => {
        it('should find all warehouses', async () => {
            mockCtx.prisma.warehouse.findMany.mockResolvedValue(
                allWarehoseMocks
            );

            const page = 1;
            const limit = 15;

            const result = await warehouseService.findAll({ page, limit });

            expect(result).toHaveLength(3);
            expect(result).toMatchObject(allWarehoseMocks);
            expect(mockCtx.prisma.warehouse.findMany).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('should update a warehouse', async () => {
            mockCtx.prisma.warehouse.findUniqueOrThrow.mockResolvedValueOnce(
                warehouseMock
            );
            mockCtx.prisma.warehouse.update.mockResolvedValue({
                ...warehouseMock,
                name: 'updated',
            });

            const result = await warehouseService.update(1, {
                name: 'updated',
            });

            expect(result.name).toEqual('updated');
        });
    });

    describe('delete', () => {
        it('should delete a warehouse', async () => {
            mockCtx.prisma.warehouse.findUniqueOrThrow.mockResolvedValueOnce(
                warehouseMock
            );
            mockCtx.prisma.warehouse.delete.mockResolvedValue(warehouseMock);

            await warehouseService.delete(warehouseMock.id);

            expect(mockCtx.prisma.warehouse.delete).toHaveBeenCalled();
        });
    });
});
