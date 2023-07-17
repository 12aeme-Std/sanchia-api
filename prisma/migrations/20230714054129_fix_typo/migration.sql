/*
  Warnings:

  - You are about to drop the `_ImageToProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `product_id` to the `image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ImageToProduct" DROP CONSTRAINT "_ImageToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImageToProduct" DROP CONSTRAINT "_ImageToProduct_B_fkey";

-- AlterTable
ALTER TABLE "image" ADD COLUMN     "product_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ImageToProduct";

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
