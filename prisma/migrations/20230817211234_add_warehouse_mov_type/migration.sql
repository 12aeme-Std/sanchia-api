/*
  Warnings:

  - The `type` column on the `warehouse_movement` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "warehouse_movement_type" AS ENUM ('WAREHOUSE_TO_WAREHOUSE', 'WAREHOUSE_TO_MIXTURE_MACHINE', 'WAREHOUSE_TO_MANUFACTURE_MACHINE', 'MIXTURE_RESULT_TO_WAREHOUSE', 'MANUFACTURE_RESULT_TO_WAREHOUSE');

-- AlterTable
ALTER TABLE "warehouse_movement" DROP COLUMN "type",
ADD COLUMN     "type" "warehouse_movement_type" NOT NULL DEFAULT 'WAREHOUSE_TO_WAREHOUSE';

-- DropEnum
DROP TYPE "warehouse_type";
