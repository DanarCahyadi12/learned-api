/*
  Warnings:

  - You are about to drop the `user_assignment_attachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_assignments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `assignment_graded` DROP FOREIGN KEY `assignment_graded_userAssignmentID_fkey`;

-- DropForeignKey
ALTER TABLE `user_assignment_attachments` DROP FOREIGN KEY `user_assignment_attachments_userAssignmentID_fkey`;

-- DropForeignKey
ALTER TABLE `user_assignments` DROP FOREIGN KEY `user_assignments_assignmentID_fkey`;

-- DropForeignKey
ALTER TABLE `user_assignments` DROP FOREIGN KEY `user_assignments_userID_fkey`;

-- DropTable
DROP TABLE `user_assignment_attachments`;

-- DropTable
DROP TABLE `user_assignments`;

-- CreateTable
CREATE TABLE `student_assignments` (
    `id` VARCHAR(191) NOT NULL,
    `assignmentID` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `submitedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `overdue` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_assignment_attachmentss` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `userAssignmentID` VARCHAR(191) NOT NULL,
    `attachment` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student_assignments` ADD CONSTRAINT `student_assignments_assignmentID_fkey` FOREIGN KEY (`assignmentID`) REFERENCES `assignments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_assignments` ADD CONSTRAINT `student_assignments_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_assignment_attachmentss` ADD CONSTRAINT `student_assignment_attachmentss_userAssignmentID_fkey` FOREIGN KEY (`userAssignmentID`) REFERENCES `student_assignments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignment_graded` ADD CONSTRAINT `assignment_graded_userAssignmentID_fkey` FOREIGN KEY (`userAssignmentID`) REFERENCES `student_assignments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
