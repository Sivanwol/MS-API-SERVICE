-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "isDeletable" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "isDeletable" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "description" DROP NOT NULL;
