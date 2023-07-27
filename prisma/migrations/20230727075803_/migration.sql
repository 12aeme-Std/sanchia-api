/*
  Warnings:

  - You are about to drop the column `quantity` on the `raw_material` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "raw_material" DROP COLUMN "quantity",
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;
