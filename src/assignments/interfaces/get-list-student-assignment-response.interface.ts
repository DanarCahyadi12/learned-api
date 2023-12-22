import { ListStudentAssignments } from '../entity';

export interface GetListStudentAssignmentResponse {
  status: string;
  message: string;
  data: {
    totalPage: number;
    prev: string | null;
    currentPage: number | null;
    next: string | null;
    items: {
      totalAssignment: number;
      assignments: ListStudentAssignments[];
    };
  };
}
