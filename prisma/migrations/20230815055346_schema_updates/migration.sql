/*
  Warnings:

  - You are about to drop the column `raw_material_id` on the `manufacture_resources` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "manufacture_resources" DROP CONSTRAINT "manufacture_resources_raw_material_id_fkey";

-- AlterTable
ALTER TABLE "manufacture_resources" DROP COLUMN "raw_material_id";

-- AlterTable
ALTER TABLE "recipe" ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
