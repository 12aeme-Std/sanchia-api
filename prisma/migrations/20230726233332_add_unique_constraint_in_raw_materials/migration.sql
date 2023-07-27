/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `raw_material` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "raw_material_name_key" ON "raw_material"("name");
