/*
  Warnings:

  - A unique constraint covering the columns `[tokenPassword]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `tokenPassword` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_tokenPassword_key` ON `users`(`tokenPassword`);
