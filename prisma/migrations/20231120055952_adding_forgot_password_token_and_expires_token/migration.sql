-- AlterTable
ALTER TABLE `users` ADD COLUMN `forgotPasswordExpires` MEDIUMTEXT NULL,
    ADD COLUMN `forgotPasswordToken` MEDIUMTEXT NULL;
