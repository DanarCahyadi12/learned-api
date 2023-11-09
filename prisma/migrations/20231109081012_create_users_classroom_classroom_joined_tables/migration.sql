-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` MEDIUMTEXT NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` MEDIUMTEXT NULL,
    `pictureURL` MEDIUMTEXT NULL,
    `bio` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classroom` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NULL,
    `bannerURL` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `classroom_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classroomJoined` (
    `id` VARCHAR(191) NOT NULL,
    `pin` BOOLEAN NOT NULL DEFAULT false,
    `userID` VARCHAR(191) NOT NULL,
    `classroomID` VARCHAR(191) NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `classroom` ADD CONSTRAINT `classroom_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classroomJoined` ADD CONSTRAINT `classroomJoined_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classroomJoined` ADD CONSTRAINT `classroomJoined_classroomID_fkey` FOREIGN KEY (`classroomID`) REFERENCES `classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
