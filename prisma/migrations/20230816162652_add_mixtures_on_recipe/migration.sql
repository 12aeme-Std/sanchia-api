/*
  Warnings:

  - You are about to drop the column `recipeId` on the `mixture_result` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "mixture_result" DROP CONSTRAINT "mixture_result_recipeId_fkey";

-- AlterTable
ALTER TABLE "mixture_result" DROP COLUMN "recipeId";

-- CreateTable
CREATE TABLE "recipe_mixture" (
    "recipe_id" INTEGER NOT NULL,
    "mixture_result_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "recipe_mixture_pkey" PRIMARY KEY ("recipe_id","mixture_result_id")
);

-- AddForeignKey
ALTER TABLE "recipe_mixture" ADD CONSTRAINT "recipe_mixture_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_mixture" ADD CONSTRAINT "recipe_mixture_mixture_result_id_fkey" FOREIGN KEY ("mixture_result_id") REFERENCES "mixture_result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
