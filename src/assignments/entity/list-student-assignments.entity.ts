import { StudentAssignmentAttachmentEntity } from './student-assignment-attachment.entity';

export interface ListStudentAssignments {
  id: string;
  overdue: boolean;
  submitedAt: Date;
  updatedAt: Date;
  users: {
    id: string;
    name: string;
    avatarURL: string;
  };
  studentAttachments: StudentAssignmentAttachmentEntity[];
}
