/*
  Warnings:

  - The values [PRODUCTION] on the enum `manufacture_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "RecipeType" AS ENUM ('FINAL_PRODUCT', 'ASSEMBLY_PRODUCT', 'MIXTURE');

-- AlterEnum
BEGIN;
CREATE TYPE "manufacture_status_new" AS ENUM ('PRODUCT', 'SEMI_PRODUCT', 'REFUSE', 'REJECTED');
ALTER TYPE "manufacture_status" RENAME TO "manufacture_status_old";
ALTER TYPE "manufacture_status_new" RENAME TO "manufacture_status";
DROP TYPE "manufacture_status_old";
COMMIT;

-- AlterTable
ALTER TABLE "mixture_result" ADD COLUMN     "recipeId" INTEGER;

-- AlterTable
ALTER TABLE "recipe" ADD COLUMN     "type" "RecipeType" NOT NULL DEFAULT 'FINAL_PRODUCT';

-- AddForeignKey
ALTER TABLE "mixture_result" ADD CONSTRAINT "mixture_result_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
