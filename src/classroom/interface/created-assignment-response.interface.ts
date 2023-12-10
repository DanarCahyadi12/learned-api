import { AssignmentEntity } from '../entity';

export interface CreatedAssignmentResponse {
  status: string;
  message: string;
  data: {
    prev: string | null;
    currentPage: number;
    next: string | null;
    totalAssignment: number;
    assignments: AssignmentEntity[];
  };
}
