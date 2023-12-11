-- AlterTable
ALTER TABLE `assignment_attachments` ADD COLUMN `path` VARCHAR(191) NULL DEFAULT 'lpmt',
    ADD COLUMN `url` VARCHAR(191) NULL DEFAULT 'lpmt';
