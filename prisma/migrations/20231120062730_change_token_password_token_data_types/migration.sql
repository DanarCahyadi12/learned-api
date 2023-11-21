/*
  Warnings:

  - You are about to alter the column `tokenPasswordExpires` on the `users` table. The data in that column could be lost. The data in that column will be cast from `MediumText` to `Int`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `tokenPasswordExpires` INTEGER NULL;
