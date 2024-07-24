/*
  Warnings:

  - Made the column `status` on table `planning` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "production_results_status" AS ENUM ('PENDING', 'SYNC', 'ERROR');

-- AlterTable
ALTER TABLE "planning" ADD COLUMN     "hasProduction" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'INACTIVE';

-- AlterTable
ALTER TABLE "raw_material" ADD COLUMN     "alternativeStock" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "production_plan" (
    "id" SERIAL NOT NULL,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "planning_id" INTEGER NOT NULL,
    "manufacture_product_id" INTEGER,
    "manufacture_machine_id" INTEGER NOT NULL,
    "planning_spec_id" INTEGER NOT NULL,

    CONSTRAINT "production_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_results" (
    "id" SERIAL NOT NULL,
    "pieces" INTEGER NOT NULL,
    "waste" INTEGER DEFAULT 0,
    "burr" INTEGER DEFAULT 0,
    "status" "production_results_status" NOT NULL DEFAULT 'PENDING',
    "errorMesage" TEXT,
    "production_plan_id" INTEGER NOT NULL,
    "warehouse_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "production_plan_planning_spec_id_key" ON "production_plan"("planning_spec_id");

-- AddForeignKey
ALTER TABLE "production_plan" ADD CONSTRAINT "production_plan_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "planning"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_plan" ADD CONSTRAINT "production_plan_manufacture_product_id_fkey" FOREIGN KEY ("manufacture_product_id") REFERENCES "product_result"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_plan" ADD CONSTRAINT "production_plan_manufacture_machine_id_fkey" FOREIGN KEY ("manufacture_machine_id") REFERENCES "manufacture_machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_plan" ADD CONSTRAINT "production_plan_planning_spec_id_fkey" FOREIGN KEY ("planning_spec_id") REFERENCES "planning_spec"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_results" ADD CONSTRAINT "production_results_production_plan_id_fkey" FOREIGN KEY ("production_plan_id") REFERENCES "production_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_results" ADD CONSTRAINT "production_results_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
