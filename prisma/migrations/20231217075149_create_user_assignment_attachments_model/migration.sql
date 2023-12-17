/*
  Warnings:

  - You are about to drop the column `assignmentURL` on the `user_assignments` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `user_assignments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user_assignments` DROP COLUMN `assignmentURL`,
    DROP COLUMN `type`;

-- CreateTable
CREATE TABLE `user_assignment_attachments` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `userAssignmentID` VARCHAR(191) NOT NULL,
    `attachments` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_assignment_attachments` ADD CONSTRAINT `user_assignment_attachments_userAssignmentID_fkey` FOREIGN KEY (`userAssignmentID`) REFERENCES `user_assignments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
