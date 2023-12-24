export class CreateStudentAssignmentDto {
  assignmentID: string;
  userID: string;
  URLs: string[];
  files: Express.Multer.File[];
  overdue: boolean;
}
