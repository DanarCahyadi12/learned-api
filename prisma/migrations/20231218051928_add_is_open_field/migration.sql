/*
  Warnings:

  - You are about to drop the column `dateClose` on the `quiz` table. All the data in the column will be lost.
  - You are about to drop the column `dateOpen` on the `quiz` table. All the data in the column will be lost.
  - You are about to drop the column `attachments` on the `user_assignment_attachments` table. All the data in the column will be lost.
  - Added the required column `attachment` to the `user_assignment_attachments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assignments` ADD COLUMN `isOpen` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `quiz` DROP COLUMN `dateClose`,
    DROP COLUMN `dateOpen`,
    ADD COLUMN `closedAt` DATETIME(3) NULL,
    ADD COLUMN `isClosed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isOpen` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `openedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user_assignment_attachments` DROP COLUMN `attachments`,
    ADD COLUMN `attachment` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user_assignments` ALTER COLUMN `overdue` DROP DEFAULT;
