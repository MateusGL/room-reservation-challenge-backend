import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ReservationTypeormEntity } from '../reservations/reservation-typeorm.entity';

@Entity('users')
export class UserTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToMany(() => ReservationTypeormEntity, (reservation) => reservation.user)
  reservations: ReservationTypeormEntity[];

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
