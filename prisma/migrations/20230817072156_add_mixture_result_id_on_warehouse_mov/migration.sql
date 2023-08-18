-- AlterTable
ALTER TABLE "warehouse_movement" ADD COLUMN     "mixture_result_id" INTEGER;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_mixture_result_id_fkey" FOREIGN KEY ("mixture_result_id") REFERENCES "mixture_result"("id") ON DELETE SET NULL ON UPDATE CASCADE;
