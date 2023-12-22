/*
  Warnings:

  - You are about to drop the column `assignmentPath` on the `student_assignments` table. All the data in the column will be lost.
  - You are about to drop the column `assignmentURL` on the `student_assignments` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `student_assignments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `student_assignments` DROP COLUMN `assignmentPath`,
    DROP COLUMN `assignmentURL`,
    DROP COLUMN `type`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `student_assignment_attachments` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `studentAssignmentID` VARCHAR(191) NOT NULL,
    `attachmentURL` MEDIUMTEXT NOT NULL,
    `attachmentPath` MEDIUMTEXT NULL,

    UNIQUE INDEX `student_assignment_attachments_studentAssignmentID_key`(`studentAssignmentID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student_assignment_attachments` ADD CONSTRAINT `student_assignment_attachments_studentAssignmentID_fkey` FOREIGN KEY (`studentAssignmentID`) REFERENCES `student_assignments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
