/*
  Warnings:

  - You are about to drop the column `access_token` on the `user` table. All the data in the column will be lost.
  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pre_order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promotion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image_url` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "roles" AS ENUM ('ADMIN', 'SELLER', 'DISTRIBUTOR', 'BUYER');

-- CreateEnum
CREATE TYPE "promo_type" AS ENUM ('PERCENTAGE', 'MONEY');

-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_client_id_fkey";

-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_product_id_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_client_id_fkey";

-- DropForeignKey
ALTER TABLE "order_detail" DROP CONSTRAINT "order_detail_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_detail" DROP CONSTRAINT "order_detail_product_id_fkey";

-- DropForeignKey
ALTER TABLE "pre_order" DROP CONSTRAINT "pre_order_client_id_fkey";

-- DropForeignKey
ALTER TABLE "pre_order" DROP CONSTRAINT "pre_order_user_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_category_id_fkey";

-- DropForeignKey
ALTER TABLE "product_image" DROP CONSTRAINT "product_image_product_id_fkey";

-- DropIndex
DROP INDEX "category_name_key";

-- DropIndex
DROP INDEX "product_name_key";

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image_url" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "access_token",
ADD COLUMN     "acccess_token" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastname" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "roles" NOT NULL DEFAULT 'ADMIN';

-- DropTable
DROP TABLE "cart";

-- DropTable
DROP TABLE "client";

-- DropTable
DROP TABLE "order";

-- DropTable
DROP TABLE "order_detail";

-- DropTable
DROP TABLE "pre_order";

-- DropTable
DROP TABLE "product_image";

-- DropTable
DROP TABLE "promotion";

-- DropEnum
DROP TYPE "ClientRole";

-- DropEnum
DROP TYPE "PromotionType";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "products_on_carts" (
    "quantity" INTEGER NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "products_on_carts_pkey" PRIMARY KEY ("cart_id","product_id")
);

-- CreateTable
CREATE TABLE "products_on_orders" (
    "quantity" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "products_on_orders_pkey" PRIMARY KEY ("order_id","product_id")
);

-- CreateTable
CREATE TABLE "promos_on_products" (
    "product_id" INTEGER NOT NULL,
    "promo_id" INTEGER NOT NULL,

    CONSTRAINT "promos_on_products_pkey" PRIMARY KEY ("product_id","promo_id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ordered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "promo_type" NOT NULL,
    "amount" INTEGER NOT NULL,
    "isEnable" BOOLEAN NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_user_id_key" ON "Cart"("user_id");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_carts" ADD CONSTRAINT "products_on_carts_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_carts" ADD CONSTRAINT "products_on_carts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_orders" ADD CONSTRAINT "products_on_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_orders" ADD CONSTRAINT "products_on_orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promos_on_products" ADD CONSTRAINT "promos_on_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promos_on_products" ADD CONSTRAINT "promos_on_products_promo_id_fkey" FOREIGN KEY ("promo_id") REFERENCES "promo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
