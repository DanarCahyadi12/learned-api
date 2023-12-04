/*
  Warnings:

  - Added the required column `classroomID` to the `materials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `materials` ADD COLUMN `classroomID` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `materials` ADD CONSTRAINT `materials_classroomID_fkey` FOREIGN KEY (`classroomID`) REFERENCES `classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
