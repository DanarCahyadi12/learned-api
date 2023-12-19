export interface StudentAssignmentAttachmentEntity {
  id: string;
  type: string;
  studentAssignmentID: string;
  attachmentURL: string;
  attachmentPath: string;
  createdAt: Date;
}
