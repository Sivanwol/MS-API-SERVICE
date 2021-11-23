/*
  Warnings:

  - The primary key for the `activity_log` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `userId` column on the `activity_log` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `assets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `assets_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `assets_categories_has_assets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `roles_has_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `userAccess` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users_has_roles_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId]` on the table `user_profile` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `id` on the `activity_log` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `assets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `assets_categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `assetId` on the `assets_categories_has_assets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `categoryId` on the `assets_categories_has_assets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `assignedById` on the `assets_categories_has_assets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `roles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roleId` on the `roles_has_permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `permissionId` on the `roles_has_permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `assignedById` on the `roles_has_permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `userAccess` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `user_profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `users_has_roles_permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roleId` on the `users_has_roles_permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `permissionId` on the `users_has_roles_permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `assignedById` on the `users_has_roles_permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `verification_requests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "activity_log" DROP CONSTRAINT "activity_log_userId_fkey";

-- DropForeignKey
ALTER TABLE "assets_categories_has_assets" DROP CONSTRAINT "assets_categories_has_assets_assetId_fkey";

-- DropForeignKey
ALTER TABLE "assets_categories_has_assets" DROP CONSTRAINT "assets_categories_has_assets_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "roles_has_permissions" DROP CONSTRAINT "roles_has_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "roles_has_permissions" DROP CONSTRAINT "roles_has_permissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "user_profile" DROP CONSTRAINT "user_profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "users_has_roles_permissions" DROP CONSTRAINT "users_has_roles_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "users_has_roles_permissions" DROP CONSTRAINT "users_has_roles_permissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "users_has_roles_permissions" DROP CONSTRAINT "users_has_roles_permissions_userId_fkey";

-- DropForeignKey
ALTER TABLE "verification_requests" DROP CONSTRAINT "verification_requests_userId_fkey";

-- AlterTable
ALTER TABLE "activity_log" DROP CONSTRAINT "activity_log_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID,
ADD CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "assets" DROP CONSTRAINT "assets_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "assets_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "assets_categories" DROP CONSTRAINT "assets_categories_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "assets_categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "assets_categories_has_assets" DROP CONSTRAINT "assets_categories_has_assets_pkey",
DROP COLUMN "assetId",
ADD COLUMN     "assetId" UUID NOT NULL,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" UUID NOT NULL,
DROP COLUMN "assignedById",
ADD COLUMN     "assignedById" UUID NOT NULL,
ADD CONSTRAINT "assets_categories_has_assets_pkey" PRIMARY KEY ("assetId", "categoryId");

-- AlterTable
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "roles" DROP CONSTRAINT "roles_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "roles_has_permissions" DROP CONSTRAINT "roles_has_permissions_pkey",
DROP COLUMN "roleId",
ADD COLUMN     "roleId" UUID NOT NULL,
DROP COLUMN "permissionId",
ADD COLUMN     "permissionId" UUID NOT NULL,
DROP COLUMN "assignedById",
ADD COLUMN     "assignedById" UUID NOT NULL,
ADD CONSTRAINT "roles_has_permissions_pkey" PRIMARY KEY ("roleId", "permissionId");

-- AlterTable
ALTER TABLE "userAccess" DROP CONSTRAINT "userAccess_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "userAccess_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "userAccess_id_seq";

-- AlterTable
ALTER TABLE "user_profile" DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users_has_roles_permissions" DROP CONSTRAINT "users_has_roles_permissions_pkey",
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "roleId",
ADD COLUMN     "roleId" UUID NOT NULL,
DROP COLUMN "permissionId",
ADD COLUMN     "permissionId" UUID NOT NULL,
DROP COLUMN "assignedById",
ADD COLUMN     "assignedById" UUID NOT NULL,
ADD CONSTRAINT "users_has_roles_permissions_pkey" PRIMARY KEY ("userId", "roleId", "permissionId");

-- AlterTable
ALTER TABLE "verification_requests" DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "activity_log_userId_idx" ON "activity_log"("userId");

-- CreateIndex
CREATE INDEX "assets_categories_has_assets_assetId_idx" ON "assets_categories_has_assets"("assetId");

-- CreateIndex
CREATE INDEX "assets_categories_has_assets_assignedById_idx" ON "assets_categories_has_assets"("assignedById");

-- CreateIndex
CREATE INDEX "assets_categories_has_assets_categoryId_idx" ON "assets_categories_has_assets"("categoryId");

-- CreateIndex
CREATE INDEX "roles_has_permissions_assignedById_idx" ON "roles_has_permissions"("assignedById");

-- CreateIndex
CREATE INDEX "roles_has_permissions_permissionId_idx" ON "roles_has_permissions"("permissionId");

-- CreateIndex
CREATE INDEX "roles_has_permissions_roleId_idx" ON "roles_has_permissions"("roleId");

-- CreateIndex
CREATE INDEX "userAccess_userId_idx" ON "userAccess"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_userId_key" ON "user_profile"("userId");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

-- CreateIndex
CREATE INDEX "users_has_roles_permissions_assignedById_idx" ON "users_has_roles_permissions"("assignedById");

-- CreateIndex
CREATE INDEX "users_has_roles_permissions_permissionId_idx" ON "users_has_roles_permissions"("permissionId");

-- CreateIndex
CREATE INDEX "users_has_roles_permissions_roleId_idx" ON "users_has_roles_permissions"("roleId");

-- CreateIndex
CREATE INDEX "users_has_roles_permissions_userId_idx" ON "users_has_roles_permissions"("userId");

-- CreateIndex
CREATE INDEX "verification_requests_userId_idx" ON "verification_requests"("userId");

-- AddForeignKey
ALTER TABLE "assets_categories_has_assets" ADD CONSTRAINT "assets_categories_has_assets_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets_categories_has_assets" ADD CONSTRAINT "assets_categories_has_assets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "assets_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_has_roles_permissions" ADD CONSTRAINT "users_has_roles_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_has_roles_permissions" ADD CONSTRAINT "users_has_roles_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_has_roles_permissions" ADD CONSTRAINT "users_has_roles_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_has_permissions" ADD CONSTRAINT "roles_has_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_has_permissions" ADD CONSTRAINT "roles_has_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
