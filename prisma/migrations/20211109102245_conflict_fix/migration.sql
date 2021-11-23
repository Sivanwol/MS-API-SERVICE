-- AlterTable
ALTER TABLE "users" ALTER COLUMN "verifiedAccessAt" DROP NOT NULL,
ALTER COLUMN "verifiedAccessMethod" SET DEFAULT E'Email';
