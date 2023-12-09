import { ClassroomCreatedAssignmentEntity } from '../entity';

export interface ClassroomCreatedAssignmentResponse {
  status: string;
  message: string;
  data: {
    total: number;
    assignments: ClassroomCreatedAssignmentEntity[];
  };
}
