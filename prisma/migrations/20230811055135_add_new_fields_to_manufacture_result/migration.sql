/*
  Warnings:

  - Added the required column `burrQuantity` to the `manufacture_result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productResultName` to the `manufacture_result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productResultQuantity` to the `manufacture_result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wasteQuantity` to the `manufacture_result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "manufacture_result" ADD COLUMN     "burr" TEXT NOT NULL DEFAULT 'REBABA',
ADD COLUMN     "burrQuantity" INTEGER NOT NULL,
ADD COLUMN     "productResultName" TEXT NOT NULL,
ADD COLUMN     "productResultQuantity" INTEGER NOT NULL,
ADD COLUMN     "waste" TEXT NOT NULL DEFAULT 'DESPERDICIO',
ADD COLUMN     "wasteQuantity" INTEGER NOT NULL;
