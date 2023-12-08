/*
  Warnings:

  - Added the required column `material` to the `materials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `materials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `materials` ADD COLUMN `material` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;
