/*
  Warnings:

  - You are about to drop the column `cartId` on the `external_user` table. All the data in the column will be lost.
  - You are about to drop the column `externalUserId` on the `order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[external_user]` on the table `cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `external_user` to the `cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_user` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_user_id` to the `pre_order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "external_user" DROP CONSTRAINT "external_user_cartId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_externalUserId_fkey";

-- AlterTable
ALTER TABLE "cart" ADD COLUMN     "external_user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "external_user" DROP COLUMN "cartId";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "externalUserId",
ADD COLUMN     "external_user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "pre_order" ADD COLUMN     "external_user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cart_external_user_key" ON "cart"("external_user");

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_external_user_fkey" FOREIGN KEY ("external_user") REFERENCES "external_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_external_user_fkey" FOREIGN KEY ("external_user") REFERENCES "external_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_order" ADD CONSTRAINT "pre_order_external_user_id_fkey" FOREIGN KEY ("external_user_id") REFERENCES "external_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
