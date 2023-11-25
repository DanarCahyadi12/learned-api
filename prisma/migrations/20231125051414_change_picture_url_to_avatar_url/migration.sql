/*
  Warnings:

  - You are about to drop the column `pictureURL` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `pictureURL`,
    ADD COLUMN `avatarURL` MEDIUMTEXT NULL;
