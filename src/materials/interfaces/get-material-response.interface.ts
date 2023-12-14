import { MaterialsEntity } from '../entity';

export interface GetMaterialResponse {
  status: string;
  message: string;
  data: {
    totalPage: number;
    prev: string | null;
    currentPage: number;
    next: string | null;
    items: {
      totalMaterial: number;
      materials: MaterialsEntity[];
    };
  };
}
