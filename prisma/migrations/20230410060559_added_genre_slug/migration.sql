-- AlterTable
ALTER TABLE "Genre" ALTER COLUMN "igdb_id" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "slug" DROP NOT NULL;