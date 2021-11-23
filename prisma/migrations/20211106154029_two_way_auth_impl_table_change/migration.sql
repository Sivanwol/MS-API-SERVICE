/*
  Warnings:

  - Added the required column `temp_secret` to the `verification_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `verification_requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VerificationRequestType" AS ENUM ('Mobile', 'Email');

-- AlterTable
ALTER TABLE "verification_requests" ADD COLUMN     "temp_secret" TEXT NOT NULL,
ADD COLUMN     "type" "VerificationRequestType" NOT NULL;
