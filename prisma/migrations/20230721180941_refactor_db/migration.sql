-- CreateEnum
CREATE TYPE "warehouse_type" AS ENUM ('PRODUCT', 'MIX');

-- CreateEnum
CREATE TYPE "raw_materials" AS ENUM ('PRODUCT', 'RAW');

-- CreateEnum
CREATE TYPE "manufacture_status" AS ENUM ('PRODUCT', 'PRODUCTION', 'REFUSE', 'REJECTED');

-- CreateTable
CREATE TABLE "warehouse" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_material" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "warehouse_id" INTEGER NOT NULL,
    "type" "raw_materials" NOT NULL DEFAULT 'RAW',

    CONSTRAINT "raw_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mixture" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "mixture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machine" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacture" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "machine_id" INTEGER NOT NULL,
    "raw_material_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "status" "manufacture_status" NOT NULL,

    CONSTRAINT "manufacture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mix_raw_material" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "mixture_id" INTEGER NOT NULL,
    "raw_material_id" INTEGER NOT NULL,

    CONSTRAINT "mix_raw_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mix_machine" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "mixture_id" INTEGER NOT NULL,
    "machine_id" INTEGER NOT NULL,

    CONSTRAINT "mix_machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_movement" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL,
    "type" "warehouse_type" NOT NULL,
    "warehouse_origin_id" INTEGER NOT NULL,
    "warehouse_destination_id" INTEGER NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "raw_material_id" INTEGER NOT NULL,
    "mixture_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "warehouse_movement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_name_key" ON "warehouse"("name");

-- CreateIndex
CREATE UNIQUE INDEX "mixture_name_key" ON "mixture"("name");

-- CreateIndex
CREATE UNIQUE INDEX "machine_name_key" ON "machine"("name");

-- AddForeignKey
ALTER TABLE "raw_material" ADD CONSTRAINT "raw_material_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manufacture" ADD CONSTRAINT "manufacture_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manufacture" ADD CONSTRAINT "manufacture_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manufacture" ADD CONSTRAINT "manufacture_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mix_raw_material" ADD CONSTRAINT "mix_raw_material_mixture_id_fkey" FOREIGN KEY ("mixture_id") REFERENCES "mixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mix_raw_material" ADD CONSTRAINT "mix_raw_material_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mix_machine" ADD CONSTRAINT "mix_machine_mixture_id_fkey" FOREIGN KEY ("mixture_id") REFERENCES "mixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mix_machine" ADD CONSTRAINT "mix_machine_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_warehouse_origin_id_fkey" FOREIGN KEY ("warehouse_origin_id") REFERENCES "warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_warehouse_destination_id_fkey" FOREIGN KEY ("warehouse_destination_id") REFERENCES "warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_mixture_id_fkey" FOREIGN KEY ("mixture_id") REFERENCES "mixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_movement" ADD CONSTRAINT "warehouse_movement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
