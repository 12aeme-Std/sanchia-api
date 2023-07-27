/*
  Warnings:

  - The values [PRODUCT,MIX] on the enum `warehouse_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "warehouse_type_new" AS ENUM ('WAREHOUSE_TO_MACHINE', 'MIXTURE_TO_MACHINE');
ALTER TABLE "warehouse_movement" ALTER COLUMN "type" TYPE "warehouse_type_new" USING ("type"::text::"warehouse_type_new");
ALTER TYPE "warehouse_type" RENAME TO "warehouse_type_old";
ALTER TYPE "warehouse_type_new" RENAME TO "warehouse_type";
DROP TYPE "warehouse_type_old";
COMMIT;
