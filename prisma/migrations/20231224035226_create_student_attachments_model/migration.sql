-- CreateTable
CREATE TABLE `student_assignment_attachments` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `studentAssignmentID` VARCHAR(191) NOT NULL,
    `attachmentURL` MEDIUMTEXT NOT NULL,
    `attachmentPath` MEDIUMTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student_assignment_attachments` ADD CONSTRAINT `student_assignment_attachments_studentAssignmentID_fkey` FOREIGN KEY (`studentAssignmentID`) REFERENCES `student_assignments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
