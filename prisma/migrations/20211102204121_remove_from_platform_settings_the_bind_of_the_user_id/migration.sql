/*
  Warnings:

  - The primary key for the `platform_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `platform_settings` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "platform_settings" DROP CONSTRAINT "platform_settings_userId_fkey";

-- AlterTable
ALTER TABLE "platform_settings" DROP CONSTRAINT "platform_settings_pkey",
DROP COLUMN "userId",
ADD CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("key");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name";
