import { StudentAssignmentAttachmentEntity } from './student-assignment-attachment.entity';

export interface ListStudentAssignments {
  id: string;
  submitedAt: Date;
  overdue: boolean;
  studentAttachments: StudentAssignmentAttachmentEntity[];
  users: {
    id: string;
    name: string;
    avatarURL: string;
  };
}
