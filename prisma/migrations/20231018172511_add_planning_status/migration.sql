-- CreateEnum
CREATE TYPE "planning_status" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_HOLD', 'DELETED');

-- AlterTable
ALTER TABLE "planning" ADD COLUMN     "status" "planning_status";
