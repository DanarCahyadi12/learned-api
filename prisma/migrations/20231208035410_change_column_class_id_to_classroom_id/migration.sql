/*
  Warnings:

  - You are about to drop the column `classID` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `classID` on the `quiz` table. All the data in the column will be lost.
  - Added the required column `classroomID` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classroomID` to the `quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `assignments` DROP FOREIGN KEY `assignments_classID_fkey`;

-- DropForeignKey
ALTER TABLE `quiz` DROP FOREIGN KEY `quiz_classID_fkey`;

-- AlterTable
ALTER TABLE `assignments` DROP COLUMN `classID`,
    ADD COLUMN `classroomID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `quiz` DROP COLUMN `classID`,
    ADD COLUMN `classroomID` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `quiz` ADD CONSTRAINT `quiz_classroomID_fkey` FOREIGN KEY (`classroomID`) REFERENCES `classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_classroomID_fkey` FOREIGN KEY (`classroomID`) REFERENCES `classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
