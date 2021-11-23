/*
  Warnings:

  - You are about to drop the column `userProfileId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `user_profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `user_profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_userProfileId_fkey";

-- DropIndex
DROP INDEX "users_userProfileId_key";

-- AlterTable
ALTER TABLE "user_profile" ADD COLUMN     "userId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "userProfileId";

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_userId_key" ON "user_profile"("userId");

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
