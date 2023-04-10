/*
  Warnings:

  - You are about to drop the `_GameToGenre` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `slug` to the `Genre` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_GameToGenre" DROP CONSTRAINT "_GameToGenre_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameToGenre" DROP CONSTRAINT "_GameToGenre_B_fkey";

-- AlterTable
ALTER TABLE "Genre" ADD COLUMN     "slug" TEXT NOT NULL;

-- DropTable
DROP TABLE "_GameToGenre";
