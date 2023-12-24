export class DeleteStudentAssignmentDto {
  deleteStudentAssignments?: StudentAssignmentID[];
}

interface StudentAssignmentID {
  id: string;
}
