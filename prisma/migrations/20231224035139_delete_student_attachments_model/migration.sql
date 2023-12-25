/*
  Warnings:

  - You are about to drop the `student_assignment_attachments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `student_assignment_attachments` DROP FOREIGN KEY `student_assignment_attachments_studentAssignmentID_fkey`;

-- DropTable
DROP TABLE `student_assignment_attachments`;
