/*
  Warnings:

  - You are about to drop the column `requestId` on the `activity_log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "activity_log" DROP COLUMN "requestId";
