/*
  Warnings:

  - A unique constraint covering the columns `[olimId]` on the table `product_result` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[olimId]` on the table `raw_material` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "product_result" ADD COLUMN     "olimId" INTEGER;

-- AlterTable
ALTER TABLE "raw_material" ADD COLUMN     "olimId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "product_result_olimId_key" ON "product_result"("olimId");

-- CreateIndex
CREATE UNIQUE INDEX "raw_material_olimId_key" ON "raw_material"("olimId");
