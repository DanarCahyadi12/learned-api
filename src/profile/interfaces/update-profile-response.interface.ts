import { ProfilePayload } from './profile-payload.interface';

export interface UpdateProfileResponse {
  status: string;
  message: string;
  data: ProfilePayload;
}
