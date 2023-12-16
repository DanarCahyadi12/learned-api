export interface ClassroomCreatedEntity {
  id: string;
  name: string;
  bannerURL: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  totalParticipant?: number;
}
