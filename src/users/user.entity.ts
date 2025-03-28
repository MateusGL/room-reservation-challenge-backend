import { ReservationEntity } from '../reservations/reservation.entity';

export class UserEntity {
  id: string;

  email: string;

  password: string;

  name: string;

  reservations: ReservationEntity[];
}
