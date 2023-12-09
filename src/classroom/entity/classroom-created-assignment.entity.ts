export interface ClassroomCreatedAssignmentEntity {
  id: string;
  title: string;
  description: string;
  openedAt: Date;
  closedAt: Date;
  passGrade: number;
  extensions: string;
  allowSeeGrade: boolean;
  createdAt: Date;
  updatedAt: Date;
  classroomID: string;
}
