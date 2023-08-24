/*
  Warnings:

  - You are about to drop the `resource_on_recipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "resource_on_recipe" DROP CONSTRAINT "resource_on_recipe_mixture_result_id_fkey";

-- DropForeignKey
ALTER TABLE "resource_on_recipe" DROP CONSTRAINT "resource_on_recipe_raw_material_id_fkey";

-- DropForeignKey
ALTER TABLE "resource_on_recipe" DROP CONSTRAINT "resource_on_recipe_recipe_id_fkey";

-- DropTable
DROP TABLE "resource_on_recipe";

-- CreateTable
CREATE TABLE "recipe_resources" (
    "id" SERIAL NOT NULL,
    "raw_material_id" INTEGER NOT NULL,
    "mixture_result_id" INTEGER NOT NULL,
    "recipe_id" INTEGER,

    CONSTRAINT "recipe_resources_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipe_resources" ADD CONSTRAINT "recipe_resources_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_resources" ADD CONSTRAINT "recipe_resources_mixture_result_id_fkey" FOREIGN KEY ("mixture_result_id") REFERENCES "mixture_result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_resources" ADD CONSTRAINT "recipe_resources_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
