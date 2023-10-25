-- DropForeignKey
ALTER TABLE "warehouse_movement" DROP CONSTRAINT "warehouse_movement_mixture_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_movement" DROP CONSTRAINT "warehouse_movement_raw_material_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_movement" DROP CONSTRAINT "warehouse_movement_warehouse_origin_id_fkey";

-- AlterTable
ALTER TABLE "warehouse_movement" ALTER COLUMN "warehouse_origin_id" DROP NOT NULL,
ALTER COLUMN "raw_material_id" DROP NOT NULL,
ALTER COLUMN "mixture_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_warehouse_origin_id_fkey" FOREIGN KEY ("warehouse_origin_id") REFERENCES "warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_mixture_id_fkey" FOREIGN KEY ("mixture_id") REFERENCES "mixture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_material"("id") ON DELETE SET NULL ON UPDATE CASCADE;
