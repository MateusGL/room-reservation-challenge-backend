import { ReservationEntity } from '../reservations/reservation.entity';

export class RoomEntity {
  id: string;

  name: string;

  capacity: number;

  reservations: ReservationEntity[];
}
