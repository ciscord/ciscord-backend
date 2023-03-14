/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RemoteAttachment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_messageId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_replyMessageId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_uploaderId_fkey";

-- DropForeignKey
ALTER TABLE "RemoteAttachment" DROP CONSTRAINT "RemoteAttachment_parentMessageId_fkey";

-- DropForeignKey
ALTER TABLE "RemoteAttachment" DROP CONSTRAINT "RemoteAttachment_parentReplyMessageId_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "urlList" TEXT[];

-- AlterTable
ALTER TABLE "ReplyMessage" ADD COLUMN     "urlList" TEXT[];

-- DropTable
DROP TABLE "File";

-- DropTable
DROP TABLE "RemoteAttachment";
