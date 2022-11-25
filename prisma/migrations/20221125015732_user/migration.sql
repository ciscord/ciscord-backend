-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_chanelAuthorId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_typingUsersId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "typingUsersId" DROP NOT NULL,
ALTER COLUMN "chanelAuthorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chanelAuthorId_fkey" FOREIGN KEY ("chanelAuthorId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_typingUsersId_fkey" FOREIGN KEY ("typingUsersId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
