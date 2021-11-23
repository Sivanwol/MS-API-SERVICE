/*
  Warnings:

  - You are about to drop the column `code` on the `verification_requests` table. All the data in the column will be lost.
  - Added the required column `verifiedAccessMethod` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "verification_requests_code_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verifiedAccessAt" TIMESTAMP(3),
ADD COLUMN     "verifiedAccessMethod" "VerificationRequestType" NOT NULL;

-- AlterTable
ALTER TABLE "verification_requests" DROP COLUMN "code";
