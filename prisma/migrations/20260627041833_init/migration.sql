/*
  Warnings:

  - Made the column `displayName` on table `components` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "components" ALTER COLUMN "displayName" SET NOT NULL;
