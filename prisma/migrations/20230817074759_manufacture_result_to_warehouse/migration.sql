-- AlterTable
ALTER TABLE "manufacture_result" ADD COLUMN     "warehouseId" INTEGER;

-- AddForeignKey
ALTER TABLE "manufacture_result" ADD CONSTRAINT "manufacture_result_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
