/*
  Warnings:

  - You are about to alter the column `tokenPasswordExpires` on the `users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `MediumInt`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `tokenPasswordExpires` MEDIUMINT NULL;
