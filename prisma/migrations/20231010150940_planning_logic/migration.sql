-- CreateTable
CREATE TABLE "planning" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planning_spec" (
    "id" SERIAL NOT NULL,
    "is_multiple_schedule" BOOLEAN NOT NULL DEFAULT false,
    "responsible_name" TEXT NOT NULL,
    "manufacture_machine_id" INTEGER NOT NULL,
    "planning_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planning_spec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planning_schedule" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "planning_spec_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planning_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_spec" (
    "id" SERIAL NOT NULL,
    "leisure_time" INTEGER NOT NULL,
    "cycles" INTEGER NOT NULL,
    "manufacture_product_id" INTEGER NOT NULL,
    "planning_schedule_id" INTEGER,
    "planning_spec_id" INTEGER,
    "recipe_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_spec_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "planning_spec" ADD CONSTRAINT "planning_spec_manufacture_machine_id_fkey" FOREIGN KEY ("manufacture_machine_id") REFERENCES "manufacture_machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planning_spec" ADD CONSTRAINT "planning_spec_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "planning"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planning_schedule" ADD CONSTRAINT "planning_schedule_planning_spec_id_fkey" FOREIGN KEY ("planning_spec_id") REFERENCES "planning_spec"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_spec" ADD CONSTRAINT "production_spec_manufacture_product_id_fkey" FOREIGN KEY ("manufacture_product_id") REFERENCES "product_result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_spec" ADD CONSTRAINT "production_spec_planning_schedule_id_fkey" FOREIGN KEY ("planning_schedule_id") REFERENCES "planning_schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_spec" ADD CONSTRAINT "production_spec_planning_spec_id_fkey" FOREIGN KEY ("planning_spec_id") REFERENCES "planning_spec"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_spec" ADD CONSTRAINT "production_spec_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
