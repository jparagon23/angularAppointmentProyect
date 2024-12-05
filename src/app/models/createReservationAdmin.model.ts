import { LightUser } from './LightUser.model';

export interface CreateReservationAdmin {
  selectedSlots: string[];
  userId: string;
  lightUser: LightUser | null;
  courts: string[] | null;
}
