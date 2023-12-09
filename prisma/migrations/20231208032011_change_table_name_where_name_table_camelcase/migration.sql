/*
  Warnings:

  - You are about to drop the column `material` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the `assignmentgraded` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `materialfiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `assignmentgraded` DROP FOREIGN KEY `assignmentGraded_userAssignmentID_fkey`;

-- DropForeignKey
ALTER TABLE `materialfiles` DROP FOREIGN KEY `materialFiles_materialID_fkey`;

-- AlterTable
ALTER TABLE `materials` DROP COLUMN `material`,
    DROP COLUMN `type`;

-- DropTable
DROP TABLE `assignmentgraded`;

-- DropTable
DROP TABLE `materialfiles`;

-- CreateTable
CREATE TABLE `assignment_graded` (
    `id` VARCHAR(191) NOT NULL,
    `userAssignmentID` VARCHAR(191) NOT NULL,
    `grade` INTEGER NOT NULL,
    `gradedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `assignment_graded_userAssignmentID_key`(`userAssignmentID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `material_files` (
    `id` VARCHAR(191) NOT NULL,
    `materialID` VARCHAR(191) NOT NULL,
    `materialURL` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assignment_graded` ADD CONSTRAINT `assignment_graded_userAssignmentID_fkey` FOREIGN KEY (`userAssignmentID`) REFERENCES `user_assignments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `material_files` ADD CONSTRAINT `material_files_materialID_fkey` FOREIGN KEY (`materialID`) REFERENCES `materials`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
