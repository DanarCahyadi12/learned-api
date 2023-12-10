import { AssignmentEntity } from '../enitity';
export interface GetAssignmentResponse {
  status: string;
  message: string;
  data: {
    totalPage: number;
    prev: string | null;
    currentPage: number;
    next: string | null;
    items: {
      totalAssignment: number;
      assignments: AssignmentEntity[];
    };
  };
}
