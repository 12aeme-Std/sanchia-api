/*
  Warnings:

  - You are about to drop the `recipe_material` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe_mixture` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "recipe_material" DROP CONSTRAINT "recipe_material_raw_material_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_material" DROP CONSTRAINT "recipe_material_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_mixture" DROP CONSTRAINT "recipe_mixture_mixture_result_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_mixture" DROP CONSTRAINT "recipe_mixture_recipe_id_fkey";

-- DropTable
DROP TABLE "recipe_material";

-- DropTable
DROP TABLE "recipe_mixture";

-- CreateTable
CREATE TABLE "ResourceOnRecipe" (
    "id" INTEGER NOT NULL,
    "raw_material_id" INTEGER NOT NULL,
    "mixture_result_id" INTEGER NOT NULL,
    "recipeId" INTEGER,

    CONSTRAINT "ResourceOnRecipe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResourceOnRecipe" ADD CONSTRAINT "ResourceOnRecipe_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceOnRecipe" ADD CONSTRAINT "ResourceOnRecipe_mixture_result_id_fkey" FOREIGN KEY ("mixture_result_id") REFERENCES "mixture_result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceOnRecipe" ADD CONSTRAINT "ResourceOnRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
