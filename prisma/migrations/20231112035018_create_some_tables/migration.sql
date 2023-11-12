-- CreateTable
CREATE TABLE `quiz` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `dateOpen` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateClose` DATETIME(3) NULL,
    `passGrade` INTEGER NULL,
    `timeLimits` VARCHAR(191) NULL,
    `randomQuestion` BOOLEAN NOT NULL DEFAULT false,
    `randomAnswer` BOOLEAN NOT NULL DEFAULT false,
    `totalQuestion` INTEGER NOT NULL,
    `allowSeeGrade` BOOLEAN NOT NULL DEFAULT true,
    `allowSeeResult` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `classID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_questions` (
    `id` VARCHAR(191) NOT NULL,
    `number` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `questionImageURL` VARCHAR(191) NULL,
    `typeAnswer` VARCHAR(191) NOT NULL,
    `answerA` VARCHAR(191) NOT NULL,
    `answerB` VARCHAR(191) NOT NULL,
    `answerC` VARCHAR(191) NOT NULL,
    `correctAnswer` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `quizID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_results` (
    `id` VARCHAR(191) NOT NULL,
    `quizID` VARCHAR(191) NULL,
    `userID` VARCHAR(191) NOT NULL,
    `grade` INTEGER NOT NULL,
    `gradingPass` BOOLEAN NOT NULL,
    `attemptedAt` DATETIME(3) NOT NULL,
    `submitedAt` DATETIME(3) NOT NULL,
    `workDuration` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `quiz_results_quizID_key`(`quizID`),
    UNIQUE INDEX `quiz_results_userID_key`(`userID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_question_results` (
    `id` VARCHAR(191) NOT NULL,
    `quizResultID` VARCHAR(191) NOT NULL,
    `questionID` VARCHAR(191) NULL,
    `userAnswer` VARCHAR(191) NULL,
    `isCorrect` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quiz` ADD CONSTRAINT `quiz_classID_fkey` FOREIGN KEY (`classID`) REFERENCES `classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_questions` ADD CONSTRAINT `quiz_questions_quizID_fkey` FOREIGN KEY (`quizID`) REFERENCES `quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_results` ADD CONSTRAINT `quiz_results_quizID_fkey` FOREIGN KEY (`quizID`) REFERENCES `quiz`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_results` ADD CONSTRAINT `quiz_results_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_question_results` ADD CONSTRAINT `quiz_question_results_quizResultID_fkey` FOREIGN KEY (`quizResultID`) REFERENCES `quiz_results`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_question_results` ADD CONSTRAINT `quiz_question_results_questionID_fkey` FOREIGN KEY (`questionID`) REFERENCES `quiz_questions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
