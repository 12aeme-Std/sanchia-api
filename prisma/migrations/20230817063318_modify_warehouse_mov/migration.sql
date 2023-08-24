/*
  Warnings:

  - The values [WAREHOUSE_TO_MACHINE,MIXTURE_TO_MACHINE] on the enum `warehouse_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "warehouse_type_new" AS ENUM ('WAREHOUSE_TO_WAREHOUSE', 'WAREHOUSE_TO_MIXTURE_MACHINE', 'MANUFACTURE_RESULT_TO_WAREHOUSE');
ALTER TABLE "warehouse_movement" ALTER COLUMN "type" TYPE "warehouse_type_new" USING ("type"::text::"warehouse_type_new");
ALTER TYPE "warehouse_type" RENAME TO "warehouse_type_old";
ALTER TYPE "warehouse_type_new" RENAME TO "warehouse_type";
DROP TYPE "warehouse_type_old";
COMMIT;

-- AlterTable
ALTER TABLE "mixture_result" ADD COLUMN     "warehouse_id" INTEGER;

-- AlterTable
ALTER TABLE "warehouse_movement" ADD COLUMN     "manufacture_result_id" INTEGER;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_manufacture_result_id_fkey" FOREIGN KEY ("manufacture_result_id") REFERENCES "manufacture_result"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mixture_result" ADD CONSTRAINT "mixture_result_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
