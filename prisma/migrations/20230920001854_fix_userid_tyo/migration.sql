/*
  Warnings:

  - You are about to drop the column `userId` on the `cart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_userId_fkey";

-- DropIndex
DROP INDEX "cart_userId_key";

-- AlterTable
ALTER TABLE "cart" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cart_user_id_key" ON "cart"("user_id");

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
