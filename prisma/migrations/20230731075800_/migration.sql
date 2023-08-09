-- DropForeignKey
ALTER TABLE "manufacture_resources" DROP CONSTRAINT "manufacture_resources_mixture_id_fkey";

-- DropForeignKey
ALTER TABLE "manufacture_resources" DROP CONSTRAINT "manufacture_resources_raw_material_id_fkey";

-- DropForeignKey
ALTER TABLE "mixture_material" DROP CONSTRAINT "mixture_material_mixture_id_fkey";

-- DropForeignKey
ALTER TABLE "mixture_result" DROP CONSTRAINT "mixture_result_mixture_id_fkey";

-- AlterTable
ALTER TABLE "manufacture_resources" ALTER COLUMN "mixture_id" DROP NOT NULL,
ALTER COLUMN "raw_material_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "mixture_material" ADD CONSTRAINT "mixture_material_mixture_id_fkey" FOREIGN KEY ("mixture_id") REFERENCES "mixture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mixture_result" ADD CONSTRAINT "mixture_result_mixture_id_fkey" FOREIGN KEY ("mixture_id") REFERENCES "mixture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manufacture_resources" ADD CONSTRAINT "manufacture_resources_mixture_id_fkey" FOREIGN KEY ("mixture_id") REFERENCES "mixture_result"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manufacture_resources" ADD CONSTRAINT "manufacture_resources_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_material"("id") ON DELETE SET NULL ON UPDATE CASCADE;
