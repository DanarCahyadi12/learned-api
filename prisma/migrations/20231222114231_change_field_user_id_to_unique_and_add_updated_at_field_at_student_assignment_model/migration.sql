/*
  Warnings:

  - A unique constraint covering the columns `[userID]` on the table `student_assignments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `student_assignments_userID_key` ON `student_assignments`(`userID`);
