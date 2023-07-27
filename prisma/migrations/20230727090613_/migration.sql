/*
  Warnings:

  - You are about to drop the column `machine_id` on the `manufacture` table. All the data in the column will be lost.
  - You are about to drop the column `manufacture_product_id` on the `manufacture` table. All the data in the column will be lost.
  - You are about to drop the column `raw_material_id` on the `manufacture` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `manufacture` table. All the data in the column will be lost.
  - You are about to drop the column `mixture_id` on the `recipe` table. All the data in the column will be lost.
  - You are about to drop the column `raw_material_id` on the `recipe` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `warehouse_movement` table. All the data in the column will be lost.
  - You are about to drop the column `machine_id` on the `warehouse_movement` table. All the data in the column will be lost.
  - You are about to drop the column `mixtures_id` on the `warehouse_movement` table. All the data in the column will be lost.
  - You are about to drop the `MixtureMaterial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `machine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `machine_process` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `manufacture_product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mix_machine` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `manufacture` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `manufacture_machine_id` to the `manufacture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `manufacture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mixture_machine_id` to the `mixture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipe_id` to the `mixture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `warehouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacture_machine_id` to the `warehouse_movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mixture_machine_id` to the `warehouse_movement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MixtureMaterial" DROP CONSTRAINT "MixtureMaterial_mixtureId_fkey";

-- DropForeignKey
ALTER TABLE "MixtureMaterial" DROP CONSTRAINT "MixtureMaterial_raw_material_id_fkey";

-- DropForeignKey
ALTER TABLE "machine_process" DROP CONSTRAINT "machine_process_machine_id_fkey";

-- DropForeignKey
ALTER TABLE "manufacture" DROP CONSTRAINT "manufacture_machine_id_fkey";

-- DropForeignKey
ALTER TABLE "manufacture" DROP CONSTRAINT "manufacture_manufacture_product_id_fkey";

-- DropForeignKey
ALTER TABLE "manufacture" DROP CONSTRAINT "manufacture_raw_material_id_fkey";

-- DropForeignKey
ALTER TABLE "mix_machine" DROP CONSTRAINT "mix_machine_machine_process_id_fkey";

-- DropForeignKey
ALTER TABLE "mix_machine" DROP CONSTRAINT "mix_machine_mixture_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe" DROP CONSTRAINT "recipe_mixture_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe" DROP CONSTRAINT "recipe_raw_material_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_movement" DROP CONSTRAINT "warehouse_movement_machine_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_movement" DROP CONSTRAINT "warehouse_movement_mixtures_id_fkey";

-- AlterTable
ALTER TABLE "manufacture" DROP COLUMN "machine_id",
DROP COLUMN "manufacture_product_id",
DROP COLUMN "raw_material_id",
DROP COLUMN "status",
ADD COLUMN     "manufacture_machine_id" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "mixture" ADD COLUMN     "mixture_machine_id" INTEGER NOT NULL,
ADD COLUMN     "recipe_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "recipe" DROP COLUMN "mixture_id",
DROP COLUMN "raw_material_id";

-- AlterTable
ALTER TABLE "warehouse" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "warehouse_movement" DROP COLUMN "created_at",
DROP COLUMN "machine_id",
DROP COLUMN "mixtures_id",
ADD COLUMN     "manufacture_machine_id" INTEGER NOT NULL,
ADD COLUMN     "mixture_machine_id" INTEGER NOT NULL,
ADD COLUMN     "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "MixtureMaterial";

-- DropTable
DROP TABLE "machine";

-- DropTable
DROP TABLE "machine_process";

-- DropTable
DROP TABLE "manufacture_product";

-- DropTable
DROP TABLE "mix_machine";

-- CreateTable
CREATE TABLE "mixture_machine" (
    "id" SERIAL NOT NULL,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "mixture_machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacture_machine" (
    "id" SERIAL NOT NULL,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "manufacture_machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mixture_material" (
    "mixture_id" INTEGER NOT NULL,
    "raw_material_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "mixture_material_pkey" PRIMARY KEY ("mixture_id","raw_material_id")
);

-- CreateTable
CREATE TABLE "mixture_result" (
    "id" SERIAL NOT NULL,
    "mixture_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "finished_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mixture_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_material" (
    "recipe_id" INTEGER NOT NULL,
    "raw_material_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "recipe_material_pkey" PRIMARY KEY ("recipe_id","raw_material_id")
);

-- CreateTable
CREATE TABLE "manufacture_resources" (
    "id" SERIAL NOT NULL,
    "manufacture_id" INTEGER NOT NULL,
    "mixture_id" INTEGER NOT NULL,
    "raw_material_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "manufacture_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacture_result" (
    "id" SERIAL NOT NULL,
    "manufacture_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "finished_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "manufacture_result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mixture_machine_name_key" ON "mixture_machine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "manufacture_machine_name_key" ON "manufacture_machine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "manufacture_name_key" ON "manufacture"("name");

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_mixture_machine_id_fkey" FOREIGN KEY ("mixture_machine_id") REFERENCES "mixture_machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_manufacture_machine_id_fkey" FOREIGN KEY ("manufacture_machine_id") REFERENCES "manufacture_machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mixture" ADD CONSTRAINT "mixture_mixture_machine_id_fkey" FOREIGN KEY ("mixture_machine_id") REFERENCES "mixture_machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mixture" ADD CONSTRAINT "mixture_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mixture_material" ADD CONSTRAINT "mixture_material_mixture_id_fkey" FOREIGN KEY ("mixture_id") REFERENCES "mixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mixture_material" ADD CONSTRAINT "mixture_material_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mixture_result" ADD CONSTRAINT "mixture_result_mixture_id_fkey" FOREIGN KEY ("mixture_id") REFERENCES "mixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_material" ADD CONSTRAINT "recipe_material_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_material" ADD CONSTRAINT "recipe_material_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manufacture" ADD CONSTRAINT "manufacture_manufacture_machine_id_fkey" FOREIGN KEY ("manufacture_machine_id") REFERENCES "manufacture_machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manufacture_resources" ADD CONSTRAINT "manufacture_resources_manufacture_id_fkey" FOREIGN KEY ("manufacture_id") REFERENCES "manufacture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manufacture_resources" ADD CONSTRAINT "manufacture_resources_mixture_id_fkey" FOREIGN KEY ("mixture_id") REFERENCES "mixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manufacture_resources" ADD CONSTRAINT "manufacture_resources_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manufacture_result" ADD CONSTRAINT "manufacture_result_manufacture_id_fkey" FOREIGN KEY ("manufacture_id") REFERENCES "manufacture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
