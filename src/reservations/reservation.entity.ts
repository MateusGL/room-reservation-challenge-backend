import { UserEntity } from '../users/user.entity';
import { RoomEntity } from '../rooms/room.entity';

export class ReservationEntity {
  id: string;

  startTime: Date;

  endTime: Date;

  user: UserEntity;

  room: RoomEntity;
}
