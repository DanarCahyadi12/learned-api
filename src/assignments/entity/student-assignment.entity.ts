export interface StudentAssignmentEntity {
  id: string;
  assignmentID: string;
  userID: string;
  submitedAt: Date;
  overdue: boolean;
}
