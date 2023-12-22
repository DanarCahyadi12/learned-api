import { StudentAssignmentAttachmentEntity } from './student-assignment-attachment.entity';

export interface StudentAssignmentEntity {
  id: string;
  assignmentID: string;
  userID: string;
  submitedAt: Date;
  overdue: boolean;
  attachments?: StudentAssignmentAttachmentEntity[];
}
