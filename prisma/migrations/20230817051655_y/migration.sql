/*
  Warnings:

  - You are about to drop the `ResourceOnRecipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ResourceOnRecipe" DROP CONSTRAINT "ResourceOnRecipe_mixture_result_id_fkey";

-- DropForeignKey
ALTER TABLE "ResourceOnRecipe" DROP CONSTRAINT "ResourceOnRecipe_raw_material_id_fkey";

-- DropForeignKey
ALTER TABLE "ResourceOnRecipe" DROP CONSTRAINT "ResourceOnRecipe_recipeId_fkey";

-- DropTable
DROP TABLE "ResourceOnRecipe";

-- CreateTable
CREATE TABLE "resource_on_recipe" (
    "id" INTEGER NOT NULL,
    "raw_material_id" INTEGER NOT NULL,
    "mixture_result_id" INTEGER NOT NULL,
    "recipe_id" INTEGER,

    CONSTRAINT "resource_on_recipe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "resource_on_recipe" ADD CONSTRAINT "resource_on_recipe_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_on_recipe" ADD CONSTRAINT "resource_on_recipe_mixture_result_id_fkey" FOREIGN KEY ("mixture_result_id") REFERENCES "mixture_result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_on_recipe" ADD CONSTRAINT "resource_on_recipe_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
