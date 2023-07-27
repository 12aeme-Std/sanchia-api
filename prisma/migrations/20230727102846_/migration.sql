-- DropForeignKey
ALTER TABLE "warehouse_movement" DROP CONSTRAINT "warehouse_movement_manufacture_machine_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_movement" DROP CONSTRAINT "warehouse_movement_mixture_machine_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_movement" DROP CONSTRAINT "warehouse_movement_warehouse_destination_id_fkey";

-- AlterTable
ALTER TABLE "warehouse_movement" ALTER COLUMN "warehouse_destination_id" DROP NOT NULL,
ALTER COLUMN "manufacture_machine_id" DROP NOT NULL,
ALTER COLUMN "mixture_machine_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_warehouse_destination_id_fkey" FOREIGN KEY ("warehouse_destination_id") REFERENCES "warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_mixture_machine_id_fkey" FOREIGN KEY ("mixture_machine_id") REFERENCES "mixture_machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_manufacture_machine_id_fkey" FOREIGN KEY ("manufacture_machine_id") REFERENCES "manufacture_machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
