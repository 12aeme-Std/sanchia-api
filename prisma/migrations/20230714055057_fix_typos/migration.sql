/*
  Warnings:

  - You are about to drop the column `external_user` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `isCover` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `external_user` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `applyTo` on the `promo` table. All the data in the column will be lost.
  - You are about to drop the column `isEnable` on the `promo` table. All the data in the column will be lost.
  - Added the required column `external_user_id` to the `cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_cover` to the `image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_user_id` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apply_to` to the `promo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_enable` to the `promo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_external_user_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_external_user_fkey";

-- DropIndex
DROP INDEX "cart_external_user_key";

-- DropIndex
DROP INDEX "cart_user_id_key";

-- AlterTable
ALTER TABLE "cart" DROP COLUMN "external_user",
ADD COLUMN     "external_user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "image" DROP COLUMN "isCover",
ADD COLUMN     "is_cover" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "order" DROP COLUMN "external_user",
ADD COLUMN     "external_user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "promo" DROP COLUMN "applyTo",
DROP COLUMN "isEnable",
ADD COLUMN     "apply_to" "apply_to" NOT NULL,
ADD COLUMN     "is_enable" BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_external_user_id_fkey" FOREIGN KEY ("external_user_id") REFERENCES "external_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_external_user_id_fkey" FOREIGN KEY ("external_user_id") REFERENCES "external_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
