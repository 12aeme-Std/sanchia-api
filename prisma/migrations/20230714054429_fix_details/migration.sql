/*
  Warnings:

  - The `role` column on the `external_user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `imageUrl` on the `image` table. All the data in the column will be lost.
  - Added the required column `url` to the `image` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `applyTo` on the `promo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "external_roles" AS ENUM ('PROVIDER', 'CLIENT');

-- CreateEnum
CREATE TYPE "apply_to" AS ENUM ('ORDER', 'PRODUCT');

-- AlterTable
ALTER TABLE "external_user" DROP COLUMN "role",
ADD COLUMN     "role" "external_roles" NOT NULL DEFAULT 'CLIENT';

-- AlterTable
ALTER TABLE "image" DROP COLUMN "imageUrl",
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "promo" DROP COLUMN "applyTo",
ADD COLUMN     "applyTo" "apply_to" NOT NULL;

-- DropEnum
DROP TYPE "ApplyTo";

-- DropEnum
DROP TYPE "ExternalRole";
