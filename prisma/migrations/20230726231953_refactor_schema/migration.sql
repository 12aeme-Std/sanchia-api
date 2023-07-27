/*
  Warnings:

  - You are about to drop the column `external_user_id` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `machine_id` on the `mix_machine` table. All the data in the column will be lost.
  - You are about to drop the column `external_user_id` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `external_user_id` on the `pre_order` table. All the data in the column will be lost.
  - You are about to drop the column `mixture_id` on the `warehouse_movement` table. All the data in the column will be lost.
  - You are about to drop the `external_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mix_raw_material` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `manufacture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `manufacture_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `machine_process_id` to the `mix_machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `mixture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `raw_material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `warehouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mixtures_id` to the `warehouse_movement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "roles" ADD VALUE 'PROVIDER';
ALTER TYPE "roles" ADD VALUE 'CLIENT';

-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_external_user_id_fkey";

-- DropForeignKey
ALTER TABLE "mix_machine" DROP CONSTRAINT "mix_machine_machine_id_fkey";

-- DropForeignKey
ALTER TABLE "mix_raw_material" DROP CONSTRAINT "mix_raw_material_mixture_id_fkey";

-- DropForeignKey
ALTER TABLE "mix_raw_material" DROP CONSTRAINT "mix_raw_material_raw_material_id_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_external_user_id_fkey";

-- DropForeignKey
ALTER TABLE "pre_order" DROP CONSTRAINT "pre_order_external_user_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_movement" DROP CONSTRAINT "warehouse_movement_mixture_id_fkey";

-- DropIndex
DROP INDEX "warehouse_movement_user_id_key";

-- AlterTable
ALTER TABLE "cart" DROP COLUMN "external_user_id";

-- AlterTable
ALTER TABLE "manufacture" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "manufacture_product" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "mix_machine" DROP COLUMN "machine_id",
ADD COLUMN     "machine_process_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "mixture" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "order" DROP COLUMN "external_user_id";

-- AlterTable
ALTER TABLE "pre_order" DROP COLUMN "external_user_id";

-- AlterTable
ALTER TABLE "raw_material" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "warehouse" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "warehouse_movement" DROP COLUMN "mixture_id",
ADD COLUMN     "mixtures_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "external_user";

-- DropTable
DROP TABLE "mix_raw_material";

-- DropEnum
DROP TYPE "external_roles";

-- CreateTable
CREATE TABLE "machine_process" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "machine_id" INTEGER NOT NULL,

    CONSTRAINT "machine_process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MixtureMaterial" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "mixtureId" INTEGER NOT NULL,
    "raw_material_id" INTEGER NOT NULL,

    CONSTRAINT "MixtureMaterial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_mixtures_id_fkey" FOREIGN KEY ("mixtures_id") REFERENCES "mixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machine_process" ADD CONSTRAINT "machine_process_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mix_machine" ADD CONSTRAINT "mix_machine_machine_process_id_fkey" FOREIGN KEY ("machine_process_id") REFERENCES "machine_process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MixtureMaterial" ADD CONSTRAINT "MixtureMaterial_mixtureId_fkey" FOREIGN KEY ("mixtureId") REFERENCES "mixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MixtureMaterial" ADD CONSTRAINT "MixtureMaterial_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
