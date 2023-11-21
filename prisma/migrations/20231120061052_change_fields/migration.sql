/*
  Warnings:

  - You are about to drop the column `forgotPasswordExpires` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `forgotPasswordToken` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `forgotPasswordExpires`,
    DROP COLUMN `forgotPasswordToken`,
    ADD COLUMN `tokenPassword` MEDIUMTEXT NULL,
    ADD COLUMN `tokenPasswordExpires` MEDIUMTEXT NULL;
