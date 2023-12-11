/*
  Warnings:

  - You are about to drop the column `url` on the `assignment_attachments` table. All the data in the column will be lost.
  - Added the required column `attachmentURL` to the `assignment_attachments` table without a default value. This is not possible if the table is not empty.
  - Made the column `path` on table `assignment_attachments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `assignment_attachments` DROP COLUMN `url`,
    ADD COLUMN `attachmentURL` VARCHAR(191) NOT NULL,
    MODIFY `path` VARCHAR(191) NOT NULL;
