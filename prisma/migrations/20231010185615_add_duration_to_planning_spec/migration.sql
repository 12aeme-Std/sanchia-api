/*
  Warnings:

  - Added the required column `duration` to the `planning_schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "planning_schedule" ADD COLUMN     "duration" INTEGER NOT NULL;
