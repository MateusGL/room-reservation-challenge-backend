import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationTypeormEntity } from '../reservations/reservation-typeorm.entity';

@Entity('rooms')
export class RoomTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  capacity: number;

  @OneToMany(() => ReservationTypeormEntity, (reservation) => reservation.room)
  reservations: ReservationTypeormEntity[];
}
