/*
  Warnings:

  - A unique constraint covering the columns `[currentChannelId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentChannelId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_currentChannelId_key" ON "User"("currentChannelId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentChannelId_fkey" FOREIGN KEY ("currentChannelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
