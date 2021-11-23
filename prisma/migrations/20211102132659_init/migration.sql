-- CreateEnum
CREATE TYPE "ActionTypes" AS ENUM ('Login', 'Logout', 'UknownAction', 'CreateAssetCategory', 'UpdateAssetCategory', 'DeleteAssetCategory', 'AddAsset', 'RemoveAsset', 'TwoAuthRequest', 'TwoAuthVerify', 'ViewUsers', 'ViewUserProfile', 'DisableUser', 'EnabledUser', 'ExportUserActivity');

-- CreateTable
CREATE TABLE "platform_settings" (
    "key" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,
    "value" JSONB NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("key","userId")
);

-- CreateTable
CREATE TABLE "assets_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortBy" SMALLINT NOT NULL DEFAULT 0,
    "disabledAt" TIMESTAMP(3),
    "publishAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" BIGSERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "sortBy" SMALLINT NOT NULL DEFAULT 0,
    "metaData" JSONB NOT NULL,
    "disabledAt" TIMESTAMP(3),
    "publishAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets_categories_has_assets" (
    "assetId" BIGINT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedById" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_categories_has_assets_pkey" PRIMARY KEY ("assetId","categoryId")
);

-- CreateTable
CREATE TABLE "activity_log" (
    "id" SERIAL NOT NULL,
    "action" "ActionTypes" NOT NULL DEFAULT E'UknownAction',
    "referalIp" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "message" TEXT,
    "userId" BIGINT,
    "metaData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "userProfileId" BIGINT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "mobile" TEXT,
    "mobileVerified" TIMESTAMP(3),
    "image" TEXT,
    "disabledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_has_roles_permissions" (
    "userId" BIGINT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedById" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_has_roles_permissions_pkey" PRIMARY KEY ("userId","roleId","permissionId")
);

-- CreateTable
CREATE TABLE "roles_has_permissions" (
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedById" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_has_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "guradName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isGrend" BOOLEAN NOT NULL DEFAULT true,
    "isAllow" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "guradName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isGrend" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profile" (
    "id" BIGSERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userAccess" (
    "id" BIGSERIAL NOT NULL,
    "compoundId" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,
    "providerType" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "accessTokenExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_requests" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "code" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "platform_settings_key_key" ON "platform_settings"("key");

-- CreateIndex
CREATE INDEX "assets_categories_has_assets_assetId_idx" ON "assets_categories_has_assets"("assetId");

-- CreateIndex
CREATE INDEX "assets_categories_has_assets_categoryId_idx" ON "assets_categories_has_assets"("categoryId");

-- CreateIndex
CREATE INDEX "assets_categories_has_assets_assignedById_idx" ON "assets_categories_has_assets"("assignedById");

-- CreateIndex
CREATE INDEX "activity_log_userId_idx" ON "activity_log"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_userProfileId_key" ON "users"("userProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE INDEX "users_has_roles_permissions_userId_idx" ON "users_has_roles_permissions"("userId");

-- CreateIndex
CREATE INDEX "users_has_roles_permissions_roleId_idx" ON "users_has_roles_permissions"("roleId");

-- CreateIndex
CREATE INDEX "users_has_roles_permissions_permissionId_idx" ON "users_has_roles_permissions"("permissionId");

-- CreateIndex
CREATE INDEX "users_has_roles_permissions_assignedById_idx" ON "users_has_roles_permissions"("assignedById");

-- CreateIndex
CREATE INDEX "roles_has_permissions_roleId_idx" ON "roles_has_permissions"("roleId");

-- CreateIndex
CREATE INDEX "roles_has_permissions_permissionId_idx" ON "roles_has_permissions"("permissionId");

-- CreateIndex
CREATE INDEX "roles_has_permissions_assignedById_idx" ON "roles_has_permissions"("assignedById");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_guradName_key" ON "permissions"("guradName");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_guradName_key" ON "roles"("guradName");

-- CreateIndex
CREATE UNIQUE INDEX "userAccess_compoundId_key" ON "userAccess"("compoundId");

-- CreateIndex
CREATE INDEX "userAccess_providerAccountId_idx" ON "userAccess"("providerAccountId");

-- CreateIndex
CREATE INDEX "userAccess_providerId_idx" ON "userAccess"("providerId");

-- CreateIndex
CREATE INDEX "userAccess_userId_idx" ON "userAccess"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_requests_code_key" ON "verification_requests"("code");

-- CreateIndex
CREATE INDEX "verification_requests_userId_idx" ON "verification_requests"("userId");

-- AddForeignKey
ALTER TABLE "platform_settings" ADD CONSTRAINT "platform_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets_categories_has_assets" ADD CONSTRAINT "assets_categories_has_assets_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets_categories_has_assets" ADD CONSTRAINT "assets_categories_has_assets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "assets_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "user_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_has_roles_permissions" ADD CONSTRAINT "users_has_roles_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_has_roles_permissions" ADD CONSTRAINT "users_has_roles_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_has_roles_permissions" ADD CONSTRAINT "users_has_roles_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_has_permissions" ADD CONSTRAINT "roles_has_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_has_permissions" ADD CONSTRAINT "roles_has_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
