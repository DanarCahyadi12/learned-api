/*
  Warnings:

  - You are about to drop the column `userAssignmentID` on the `student_assignment_attachments` table. All the data in the column will be lost.
  - Added the required column `studentAssignmentID` to the `student_assignment_attachments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `student_assignment_attachments` DROP FOREIGN KEY `student_assignment_attachments_userAssignmentID_fkey`;

-- AlterTable
ALTER TABLE `student_assignment_attachments` DROP COLUMN `userAssignmentID`,
    ADD COLUMN `studentAssignmentID` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `student_assignment_attachments` ADD CONSTRAINT `student_assignment_attachments_studentAssignmentID_fkey` FOREIGN KEY (`studentAssignmentID`) REFERENCES `student_assignments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
