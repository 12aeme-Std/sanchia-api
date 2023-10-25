/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `isNew` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `ProductDimentions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductDimentions" DROP CONSTRAINT "ProductDimentions_product_id_fkey";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "isAvailable",
DROP COLUMN "isNew",
ADD COLUMN     "is_available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_new" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "ProductDimentions";

-- CreateTable
CREATE TABLE "product_dimentions" (
    "id" SERIAL NOT NULL,
    "length" TEXT,
    "width" TEXT,
    "height" TEXT,
    "weight" TEXT,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "product_dimentions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_dimentions_product_id_key" ON "product_dimentions"("product_id");

-- AddForeignKey
ALTER TABLE "product_dimentions" ADD CONSTRAINT "product_dimentions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
