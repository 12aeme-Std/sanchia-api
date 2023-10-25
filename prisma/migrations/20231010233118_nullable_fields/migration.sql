-- DropForeignKey
ALTER TABLE "product_result" DROP CONSTRAINT "product_result_manufacture_id _fkey";

-- DropForeignKey
ALTER TABLE "product_result" DROP CONSTRAINT "product_result_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "production_spec" DROP CONSTRAINT "production_spec_manufacture_product_id_fkey";

-- AlterTable
ALTER TABLE "product_result" ALTER COLUMN "recipe_id" DROP NOT NULL,
ALTER COLUMN "manufacture_id " DROP NOT NULL;

-- AlterTable
ALTER TABLE "production_spec" ALTER COLUMN "manufacture_product_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "product_result" ADD CONSTRAINT "product_result_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_result" ADD CONSTRAINT "product_result_manufacture_id _fkey" FOREIGN KEY ("manufacture_id ") REFERENCES "manufacture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_spec" ADD CONSTRAINT "production_spec_manufacture_product_id_fkey" FOREIGN KEY ("manufacture_product_id") REFERENCES "product_result"("id") ON DELETE SET NULL ON UPDATE CASCADE;
