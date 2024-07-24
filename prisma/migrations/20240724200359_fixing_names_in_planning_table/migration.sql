/*
  Warnings:

  - You are about to drop the column `hasProduction` on the `planning` table. All the data in the column will be lost.
  - You are about to drop the column `errorMesage` on the `production_results` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "planning" DROP COLUMN "hasProduction",
ADD COLUMN     "has_production" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "production_results" DROP COLUMN "errorMesage",
ADD COLUMN     "error_message" TEXT;
