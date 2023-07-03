/*
  Warnings:

  - You are about to drop the column `readedBy` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "readedBy",
ADD COLUMN     "readBy" TEXT[];
