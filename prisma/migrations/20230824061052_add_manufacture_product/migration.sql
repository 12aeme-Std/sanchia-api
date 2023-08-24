/*
  Warnings:

  - You are about to drop the column `burrQuantity` on the `manufacture_result` table. All the data in the column will be lost.
  - You are about to drop the column `productResultName` on the `manufacture_result` table. All the data in the column will be lost.
  - You are about to drop the column `productResultQuantity` on the `manufacture_result` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `manufacture_result` table. All the data in the column will be lost.
  - You are about to drop the column `warehouseId` on the `manufacture_result` table. All the data in the column will be lost.
  - You are about to drop the column `wasteQuantity` on the `manufacture_result` table. All the data in the column will be lost.
  - Changed the type of `burr` on the `manufacture_result` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `waste` on the `manufacture_result` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ManufactureProductType" AS ENUM ('SEMI_PRODUCT', 'PRODUCT');

-- DropForeignKey
ALTER TABLE "manufacture_result" DROP CONSTRAINT "manufacture_result_warehouseId_fkey";

-- AlterTable
ALTER TABLE "manufacture_resources" ADD COLUMN     "raw_material_id" INTEGER;

-- AlterTable
ALTER TABLE "manufacture_result" DROP COLUMN "burrQuantity",
DROP COLUMN "productResultName",
DROP COLUMN "productResultQuantity",
DROP COLUMN "quantity",
DROP COLUMN "warehouseId",
DROP COLUMN "wasteQuantity",
ADD COLUMN     "warehouse_id" INTEGER,
DROP COLUMN "burr",
ADD COLUMN     "burr" INTEGER NOT NULL,
DROP COLUMN "waste",
ADD COLUMN     "waste" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "product_result" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ManufactureProductType" NOT NULL DEFAULT 'PRODUCT',
    "recipe_id" INTEGER NOT NULL,
    "manufacture_id " INTEGER NOT NULL,

    CONSTRAINT "product_result_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "manufacture_resources" ADD CONSTRAINT "manufacture_resources_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manufacture_result" ADD CONSTRAINT "manufacture_result_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_result" ADD CONSTRAINT "product_result_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_result" ADD CONSTRAINT "product_result_manufacture_id _fkey" FOREIGN KEY ("manufacture_id ") REFERENCES "manufacture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
