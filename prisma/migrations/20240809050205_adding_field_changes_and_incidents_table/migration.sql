-- AlterTable
ALTER TABLE "product_result" ADD COLUMN     "productWeight" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "production_incident" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "productionPlanId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_incident_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "production_incident" ADD CONSTRAINT "production_incident_productionPlanId_fkey" FOREIGN KEY ("productionPlanId") REFERENCES "production_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
