/*
  Warnings:

  - The values [APPLIED,SHORT_LISTED,INTERVIEWING,OFFERED,HIRED,REJECTED] on the enum `ApplicationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationStatus_new" AS ENUM ('Applied', 'Short_listed', 'Interviewing', 'Offered', 'Hired', 'Rejected');
ALTER TABLE "Application" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "ApplicationStatus_new" USING ("status"::text::"ApplicationStatus_new");
ALTER TYPE "ApplicationStatus" RENAME TO "ApplicationStatus_old";
ALTER TYPE "ApplicationStatus_new" RENAME TO "ApplicationStatus";
DROP TYPE "ApplicationStatus_old";
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'Applied';
COMMIT;

-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'Applied';
