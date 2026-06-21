/*
  Warnings:

  - You are about to drop the column `component` on the `sections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sections" DROP COLUMN "component",
ADD COLUMN     "componentId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "emailVerificationTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ALTER COLUMN "role" SET DEFAULT 'tenant_main_admin';

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "components"("id") ON DELETE SET NULL ON UPDATE CASCADE;
