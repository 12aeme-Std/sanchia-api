/*
  Warnings:

  - You are about to drop the column `type` on the `raw_material` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "raw_material" DROP COLUMN "type";

-- DropEnum
DROP TYPE "raw_materials";
