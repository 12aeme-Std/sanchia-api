/*
  Warnings:

  - The `type` column on the `recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "recipe_type" AS ENUM ('FINAL_PRODUCT', 'ASSEMBLY_PRODUCT', 'MIXTURE');

-- AlterTable
ALTER TABLE "recipe" DROP COLUMN "type",
ADD COLUMN     "type" "recipe_type" NOT NULL DEFAULT 'FINAL_PRODUCT';

-- DropEnum
DROP TYPE "RecipeType";
