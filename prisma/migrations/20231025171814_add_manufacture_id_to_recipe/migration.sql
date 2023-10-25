/*
  Warnings:

  - You are about to drop the column `recipe_id` on the `product_result` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_result" DROP CONSTRAINT "product_result_recipe_id_fkey";

-- AlterTable
ALTER TABLE "product_result" DROP COLUMN "recipe_id";

-- AlterTable
ALTER TABLE "recipe" ADD COLUMN     "manufacture_product_id" INTEGER;

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_manufacture_product_id_fkey" FOREIGN KEY ("manufacture_product_id") REFERENCES "product_result"("id") ON DELETE SET NULL ON UPDATE CASCADE;
