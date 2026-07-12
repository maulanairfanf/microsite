-- AlterTable
ALTER TABLE "components" ALTER COLUMN "displayName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "showOnLanding" BOOLEAN NOT NULL DEFAULT false;
