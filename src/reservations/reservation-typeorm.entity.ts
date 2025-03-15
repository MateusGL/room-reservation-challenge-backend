import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserTypeormEntity } from '../users/users-typeorm.entity';
import { RoomTypeormEntity } from 'src/rooms/room-typeorm.entity';

@Entity('reservations')
export class ReservationTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @ManyToOne(() => UserTypeormEntity, (user) => user.reservations)
  user: UserTypeormEntity;

  @ManyToOne(() => RoomTypeormEntity, (room) => room.reservations)
  room: RoomTypeormEntity;
}
