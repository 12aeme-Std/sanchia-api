/*
  Warnings:

  - You are about to drop the column `product_id` on the `manufacture` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `warehouse_movement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `manufacture_product_id` to the `manufacture` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "manufacture" DROP CONSTRAINT "manufacture_product_id_fkey";

-- AlterTable
ALTER TABLE "manufacture" DROP COLUMN "product_id",
ADD COLUMN     "manufacture_product_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "manufacture_product" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "manufacture_product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_movement_user_id_key" ON "warehouse_movement"("user_id");

-- AddForeignKey
ALTER TABLE "manufacture" ADD CONSTRAINT "manufacture_manufacture_product_id_fkey" FOREIGN KEY ("manufacture_product_id") REFERENCES "manufacture_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
