/*
  Warnings:

  - The values [DISTRIBUTOR,BUYER] on the enum `roles` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `image_url` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products_on_carts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products_on_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promos_on_products` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `applyTo` to the `promo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExternalRole" AS ENUM ('PROVIDER', 'CLIENT');

-- CreateEnum
CREATE TYPE "ApplyTo" AS ENUM ('ORDER', 'PRODUCT');

-- AlterEnum
BEGIN;
CREATE TYPE "roles_new" AS ENUM ('ADMIN', 'SELLER', 'SUPERVISOR');
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "roles_new" USING ("role"::text::"roles_new");
ALTER TYPE "roles" RENAME TO "roles_old";
ALTER TYPE "roles_new" RENAME TO "roles";
DROP TYPE "roles_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'SELLER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_user_id_fkey";

-- DropForeignKey
ALTER TABLE "products_on_carts" DROP CONSTRAINT "products_on_carts_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "products_on_carts" DROP CONSTRAINT "products_on_carts_product_id_fkey";

-- DropForeignKey
ALTER TABLE "products_on_orders" DROP CONSTRAINT "products_on_orders_order_id_fkey";

-- DropForeignKey
ALTER TABLE "products_on_orders" DROP CONSTRAINT "products_on_orders_product_id_fkey";

-- DropForeignKey
ALTER TABLE "promos_on_products" DROP CONSTRAINT "promos_on_products_product_id_fkey";

-- DropForeignKey
ALTER TABLE "promos_on_products" DROP CONSTRAINT "promos_on_products_promo_id_fkey";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "image_url";

-- AlterTable
ALTER TABLE "promo" ADD COLUMN     "applyTo" "ApplyTo" NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'SELLER';

-- DropTable
DROP TABLE "Cart";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "products_on_carts";

-- DropTable
DROP TABLE "products_on_orders";

-- DropTable
DROP TABLE "promos_on_products";

-- CreateTable
CREATE TABLE "external_user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "acccess_token" TEXT,
    "role" "ExternalRole" NOT NULL DEFAULT 'CLIENT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "cartId" INTEGER,

    CONSTRAINT "external_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isCover" BOOLEAN NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ordered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "externalUserId" INTEGER,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pre_order" (
    "id" SERIAL NOT NULL,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ordered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "pre_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preorders_products" (
    "quantity" INTEGER NOT NULL,
    "preorder_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "preorders_products_pkey" PRIMARY KEY ("preorder_id","product_id")
);

-- CreateTable
CREATE TABLE "products_carts" (
    "quantity" INTEGER NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "products_carts_pkey" PRIMARY KEY ("cart_id","product_id")
);

-- CreateTable
CREATE TABLE "products_orders" (
    "quantity" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "products_orders_pkey" PRIMARY KEY ("order_id","product_id")
);

-- CreateTable
CREATE TABLE "promos_products" (
    "product_id" INTEGER NOT NULL,
    "promo_id" INTEGER NOT NULL,

    CONSTRAINT "promos_products_pkey" PRIMARY KEY ("product_id","promo_id")
);

-- CreateTable
CREATE TABLE "promos_orders" (
    "order_id" INTEGER NOT NULL,
    "promo_id" INTEGER NOT NULL,

    CONSTRAINT "promos_orders_pkey" PRIMARY KEY ("order_id","promo_id")
);

-- CreateTable
CREATE TABLE "_ImageToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "external_user_email_key" ON "external_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cart_user_id_key" ON "cart"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "promos_products_promo_id_key" ON "promos_products"("promo_id");

-- CreateIndex
CREATE UNIQUE INDEX "promos_orders_order_id_key" ON "promos_orders"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "promos_orders_promo_id_key" ON "promos_orders"("promo_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ImageToProduct_AB_unique" ON "_ImageToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ImageToProduct_B_index" ON "_ImageToProduct"("B");

-- AddForeignKey
ALTER TABLE "external_user" ADD CONSTRAINT "external_user_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_externalUserId_fkey" FOREIGN KEY ("externalUserId") REFERENCES "external_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_order" ADD CONSTRAINT "pre_order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preorders_products" ADD CONSTRAINT "preorders_products_preorder_id_fkey" FOREIGN KEY ("preorder_id") REFERENCES "pre_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preorders_products" ADD CONSTRAINT "preorders_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_carts" ADD CONSTRAINT "products_carts_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_carts" ADD CONSTRAINT "products_carts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_orders" ADD CONSTRAINT "products_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_orders" ADD CONSTRAINT "products_orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promos_products" ADD CONSTRAINT "promos_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promos_products" ADD CONSTRAINT "promos_products_promo_id_fkey" FOREIGN KEY ("promo_id") REFERENCES "promo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promos_orders" ADD CONSTRAINT "promos_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promos_orders" ADD CONSTRAINT "promos_orders_promo_id_fkey" FOREIGN KEY ("promo_id") REFERENCES "promo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToProduct" ADD CONSTRAINT "_ImageToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToProduct" ADD CONSTRAINT "_ImageToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
