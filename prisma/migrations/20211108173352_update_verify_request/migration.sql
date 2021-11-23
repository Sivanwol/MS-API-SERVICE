/*
  Warnings:

  - You are about to drop the column `expires` on the `verification_requests` table. All the data in the column will be lost.
  - Made the column `verifiedAccessAt` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "verifiedAccessAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "verification_requests" DROP COLUMN "expires",
ADD COLUMN     "metaData" JSONB;
