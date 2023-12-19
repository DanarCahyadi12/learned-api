/*
  Warnings:

  - You are about to drop the `student_assignment_attachmentss` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `student_assignment_attachmentss` DROP FOREIGN KEY `student_assignment_attachmentss_userAssignmentID_fkey`;

-- DropTable
DROP TABLE `student_assignment_attachmentss`;

-- CreateTable
CREATE TABLE `student_assignment_attachments` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `userAssignmentID` VARCHAR(191) NOT NULL,
    `attachmentURL` VARCHAR(191) NOT NULL,
    `attachmentPath` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student_assignment_attachments` ADD CONSTRAINT `student_assignment_attachments_userAssignmentID_fkey` FOREIGN KEY (`userAssignmentID`) REFERENCES `student_assignments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
