/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "recipe_name_key" ON "recipe"("name");
