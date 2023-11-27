/*
  Warnings:

  - The primary key for the `ratings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ratings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ratings_pkey" PRIMARY KEY ("authorId", "ratedUserId");
