/*
  Warnings:

  - The primary key for the `users_has_roles_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,permissionId,roleId]` on the table `users_has_roles_permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "users_has_roles_permissions" DROP CONSTRAINT "users_has_roles_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "users_has_roles_permissions" DROP CONSTRAINT "users_has_roles_permissions_roleId_fkey";

-- DropIndex
DROP INDEX "users_has_roles_permissions_permissionId_idx";

-- DropIndex
DROP INDEX "users_has_roles_permissions_roleId_idx";

-- DropIndex
DROP INDEX "users_has_roles_permissions_userId_idx";

-- AlterTable
ALTER TABLE "users_has_roles_permissions" DROP CONSTRAINT "users_has_roles_permissions_pkey",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ALTER COLUMN "roleId" DROP NOT NULL,
ALTER COLUMN "permissionId" DROP NOT NULL,
ADD CONSTRAINT "users_has_roles_permissions_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "users_has_roles_permissions_userId_permissionId_roleId_idx" ON "users_has_roles_permissions"("userId", "permissionId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "users_has_roles_permissions_userId_permissionId_roleId_key" ON "users_has_roles_permissions"("userId", "permissionId", "roleId");

-- AddForeignKey
ALTER TABLE "users_has_roles_permissions" ADD CONSTRAINT "users_has_roles_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_has_roles_permissions" ADD CONSTRAINT "users_has_roles_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
