import { ReservationEntity } from './reservation.entity';

export type CreateReservation = Pick<
  ReservationEntity,
  'endTime' | 'startTime' | 'room' | 'user'
>;

export type FindReservation = Partial<ReservationEntity>;

export type RelationsReservation = ('room' | 'user')[];
