/*
  Warnings:

  - You are about to drop the column `responsible_name` on the `planning_spec` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MachineManagerType" AS ENUM ('SUPERVISOR', 'QUALITY', 'OPERATOR');

-- AlterEnum
ALTER TYPE "recipe_types" ADD VALUE 'RAW_MATERIAL';

-- AlterTable
ALTER TABLE "planning_spec" DROP COLUMN "responsible_name",
ADD COLUMN     "operators" TEXT,
ADD COLUMN     "supervisor_id" INTEGER;

-- CreateTable
CREATE TABLE "machine_manager" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "MachineManagerType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machine_manager_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "planning_spec" ADD CONSTRAINT "planning_spec_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "machine_manager"("id") ON DELETE SET NULL ON UPDATE CASCADE;
