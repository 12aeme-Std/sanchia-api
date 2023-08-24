-- DropForeignKey
ALTER TABLE "recipe_resources" DROP CONSTRAINT "recipe_resources_mixture_result_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_resources" DROP CONSTRAINT "recipe_resources_raw_material_id_fkey";

-- AlterTable
ALTER TABLE "recipe_resources" ALTER COLUMN "raw_material_id" DROP NOT NULL,
ALTER COLUMN "mixture_result_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "recipe_resources" ADD CONSTRAINT "recipe_resources_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_resources" ADD CONSTRAINT "recipe_resources_mixture_result_id_fkey" FOREIGN KEY ("mixture_result_id") REFERENCES "mixture_result"("id") ON DELETE SET NULL ON UPDATE CASCADE;
