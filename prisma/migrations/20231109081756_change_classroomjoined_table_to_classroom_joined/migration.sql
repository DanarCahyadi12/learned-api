/*
  Warnings:

  - You are about to drop the `classroomjoined` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `classroomjoined` DROP FOREIGN KEY `classroomJoined_classroomID_fkey`;

-- DropForeignKey
ALTER TABLE `classroomjoined` DROP FOREIGN KEY `classroomJoined_userID_fkey`;

-- DropTable
DROP TABLE `classroomjoined`;

-- CreateTable
CREATE TABLE `classroom_joined` (
    `id` VARCHAR(191) NOT NULL,
    `pin` BOOLEAN NOT NULL DEFAULT false,
    `userID` VARCHAR(191) NOT NULL,
    `classroomID` VARCHAR(191) NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `classroom_joined` ADD CONSTRAINT `classroom_joined_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classroom_joined` ADD CONSTRAINT `classroom_joined_classroomID_fkey` FOREIGN KEY (`classroomID`) REFERENCES `classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
