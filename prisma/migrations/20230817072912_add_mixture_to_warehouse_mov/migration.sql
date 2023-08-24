/*
  Warnings:

  - Added the required column `mixture_id` to the `warehouse_movement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "warehouse_movement" ADD COLUMN     "mixture_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_mixture_id_fkey" FOREIGN KEY ("mixture_id") REFERENCES "mixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
