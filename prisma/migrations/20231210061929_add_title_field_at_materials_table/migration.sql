/*
  Warnings:

  - Added the required column `title` to the `materials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `materials` ADD COLUMN `title` VARCHAR(191) NOT NULL;
