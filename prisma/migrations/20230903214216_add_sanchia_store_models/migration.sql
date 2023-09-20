/*
  Warnings:

  - The required column `orderTracker` was added to the `order` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `status` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endurance` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('FINISHED', 'PREPARING', 'ROUTE', 'CANCELLED');

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "orderTracker" TEXT NOT NULL,
ADD COLUMN     "status" "OrderStatus" NOT NULL,
ADD COLUMN     "store" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "endurance" TEXT NOT NULL,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isNew" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ProductDimentions" (
    "id" SERIAL NOT NULL,
    "length" TEXT,
    "width" TEXT,
    "height" TEXT,
    "weight" TEXT,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "ProductDimentions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductDimentions_product_id_key" ON "ProductDimentions"("product_id");

-- AddForeignKey
ALTER TABLE "ProductDimentions" ADD CONSTRAINT "ProductDimentions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
