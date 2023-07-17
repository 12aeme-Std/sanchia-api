/*
  Warnings:

  - You are about to drop the column `discountTotal` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order" DROP COLUMN "discountTotal",
ADD COLUMN     "total_discount" DOUBLE PRECISION NOT NULL DEFAULT 0;
