-- AlterTable
CREATE SEQUENCE resource_on_recipe_id_seq;
ALTER TABLE "resource_on_recipe" ALTER COLUMN "id" SET DEFAULT nextval('resource_on_recipe_id_seq');
ALTER SEQUENCE resource_on_recipe_id_seq OWNED BY "resource_on_recipe"."id";
