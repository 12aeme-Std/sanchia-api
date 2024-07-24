-- DropForeignKey
ALTER TABLE "production_plan" DROP CONSTRAINT "production_plan_planning_spec_id_fkey";

-- DropIndex
DROP INDEX "production_plan_planning_spec_id_key";

-- AddForeignKey
ALTER TABLE "production_plan" ADD CONSTRAINT "production_plan_planning_spec_id_fkey" FOREIGN KEY ("planning_spec_id") REFERENCES "production_spec"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
