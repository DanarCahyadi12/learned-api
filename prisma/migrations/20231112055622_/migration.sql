/*
  Warnings:

  - You are about to drop the `classroom_joined` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `classroom_joined` DROP FOREIGN KEY `classroom_joined_classroomID_fkey`;

-- DropForeignKey
ALTER TABLE `classroom_joined` DROP FOREIGN KEY `classroom_joined_userID_fkey`;

-- DropForeignKey
ALTER TABLE `quiz_question_results` DROP FOREIGN KEY `quiz_question_results_questionID_fkey`;

-- DropForeignKey
ALTER TABLE `quiz_results` DROP FOREIGN KEY `quiz_results_quizID_fkey`;

-- DropTable
DROP TABLE `classroom_joined`;

-- CreateTable
CREATE TABLE `classroom_participants` (
    `id` VARCHAR(191) NOT NULL,
    `pin` BOOLEAN NOT NULL DEFAULT false,
    `userID` VARCHAR(191) NOT NULL,
    `classroomID` VARCHAR(191) NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `role` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_on_going` (
    `id` VARCHAR(191) NOT NULL,
    `quizID` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `attemptedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `quiz_on_going_userID_key`(`userID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_question_on_going` (
    `quizOnGoingID` VARCHAR(191) NOT NULL,
    `quizQuestionID` VARCHAR(191) NOT NULL,
    `userAnswer` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`quizOnGoingID`, `quizQuestionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assignments` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` MEDIUMTEXT NULL,
    `openedAt` DATETIME(3) NOT NULL,
    `closedAt` DATETIME(3) NULL,
    `passGrade` INTEGER NULL,
    `attachment` VARCHAR(191) NULL,
    `extensions` VARCHAR(191) NULL,
    `allowSeeGrade` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `classID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_assignments` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `assignmentURL` VARCHAR(191) NOT NULL,
    `assignmentID` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `submitedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `overdue` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assignmentGraded` (
    `id` VARCHAR(191) NOT NULL,
    `userAssignmentID` VARCHAR(191) NOT NULL,
    `grade` INTEGER NOT NULL,
    `gradedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `assignmentGraded_userAssignmentID_key`(`userAssignmentID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materials` (
    `id` VARCHAR(191) NOT NULL,
    `description` MEDIUMTEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materialFiles` (
    `id` VARCHAR(191) NOT NULL,
    `materialID` VARCHAR(191) NOT NULL,
    `materialURL` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `classroom_participants` ADD CONSTRAINT `classroom_participants_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classroom_participants` ADD CONSTRAINT `classroom_participants_classroomID_fkey` FOREIGN KEY (`classroomID`) REFERENCES `classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_results` ADD CONSTRAINT `quiz_results_quizID_fkey` FOREIGN KEY (`quizID`) REFERENCES `quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_question_results` ADD CONSTRAINT `quiz_question_results_questionID_fkey` FOREIGN KEY (`questionID`) REFERENCES `quiz_questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_on_going` ADD CONSTRAINT `quiz_on_going_quizID_fkey` FOREIGN KEY (`quizID`) REFERENCES `quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_on_going` ADD CONSTRAINT `quiz_on_going_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_question_on_going` ADD CONSTRAINT `quiz_question_on_going_quizOnGoingID_fkey` FOREIGN KEY (`quizOnGoingID`) REFERENCES `quiz_on_going`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_question_on_going` ADD CONSTRAINT `quiz_question_on_going_quizQuestionID_fkey` FOREIGN KEY (`quizQuestionID`) REFERENCES `quiz_questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_classID_fkey` FOREIGN KEY (`classID`) REFERENCES `classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_assignments` ADD CONSTRAINT `user_assignments_assignmentID_fkey` FOREIGN KEY (`assignmentID`) REFERENCES `assignments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_assignments` ADD CONSTRAINT `user_assignments_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignmentGraded` ADD CONSTRAINT `assignmentGraded_userAssignmentID_fkey` FOREIGN KEY (`userAssignmentID`) REFERENCES `user_assignments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materialFiles` ADD CONSTRAINT `materialFiles_materialID_fkey` FOREIGN KEY (`materialID`) REFERENCES `materials`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
