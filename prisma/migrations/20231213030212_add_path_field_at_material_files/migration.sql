/*
  Warnings:

  - Added the required column `path` to the `material_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `material_files` ADD COLUMN `path` VARCHAR(191) NOT NULL;
