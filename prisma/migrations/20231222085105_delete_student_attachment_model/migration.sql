/*
  Warnings:

  - You are about to drop the `student_assignment_attachments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `assignmentPath` to the `student_assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignmentURL` to the `student_assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `student_assignments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `student_assignment_attachments` DROP FOREIGN KEY `student_assignment_attachments_studentAssignmentID_fkey`;

-- AlterTable
ALTER TABLE `student_assignments` ADD COLUMN `assignmentPath` MEDIUMTEXT NOT NULL,
    ADD COLUMN `assignmentURL` MEDIUMTEXT NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `student_assignment_attachments`;
