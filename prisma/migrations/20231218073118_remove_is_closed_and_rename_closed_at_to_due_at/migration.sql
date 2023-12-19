/*
  Warnings:

  - You are about to drop the column `closedAt` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `isClosed` on the `assignments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `assignments` DROP COLUMN `closedAt`,
    DROP COLUMN `isClosed`,
    ADD COLUMN `dueAt` DATETIME(3) NULL;
