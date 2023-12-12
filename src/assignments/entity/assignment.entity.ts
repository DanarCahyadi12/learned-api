import { AttachmentEntity } from './assignment-attachment.entity';

export interface AssignmentEntity {
  id: string;
  title: string;
  description: string;
  openedAt: Date;
  closedAt: Date;
  passGrade: number;
  allowSeeGrade: boolean;
  extensions: string;
  createdAt: Date;
  updatedAt: Date;
  classroomID: string;
  attachments: AttachmentEntity[];
}
