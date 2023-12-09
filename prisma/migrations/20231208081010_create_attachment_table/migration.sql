/*
  Warnings:

  - You are about to drop the column `attachment` on the `assignments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `assignments` DROP COLUMN `attachment`;

-- CreateTable
CREATE TABLE `assignment_attachments` (
    `id` VARCHAR(191) NOT NULL,
    `attachmentURL` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assignmentID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assignment_attachments` ADD CONSTRAINT `assignment_attachments_assignmentID_fkey` FOREIGN KEY (`assignmentID`) REFERENCES `assignments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
