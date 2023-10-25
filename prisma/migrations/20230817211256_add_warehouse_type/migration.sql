-- CreateEnum
CREATE TYPE "warehouse_type" AS ENUM ('MIXTURE', 'RAW_MATERIAL', 'PRODUCTO', 'ASSEMPLY_PRODUCT');

-- AlterTable
ALTER TABLE "warehouse" ADD COLUMN     "type" "warehouse_type" NOT NULL DEFAULT 'RAW_MATERIAL';
