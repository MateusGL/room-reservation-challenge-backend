import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../@common/domain/base.repository';
import { BaseTypeormRepository } from 'src/@common/domain/base.typeorm.repository';
import { DataSource, LessThan, MoreThan } from 'typeorm';
import { ReservationEntity } from './reservation.entity';
import {
  CreateReservation,
  FindReservation,
  RelationsReservation,
} from './reservation.interface';
import { ReservationTypeormEntity } from './reservation-typeorm.entity';

export class ReservationRepository extends BaseRepository<
  ReservationEntity,
  CreateReservation,
  FindReservation,
  RelationsReservation
> {
  findOverlappingReservations: (
    roomId: string,
    startTime: Date,
    endTime: Date,
  ) => Promise<ReservationEntity[]>;
  findReservationByUserEmail: (email: string) => Promise<ReservationEntity[]>;
}

@Injectable()
export class ReservationTypeormRepository extends BaseTypeormRepository<
  ReservationEntity,
  CreateReservation,
  FindReservation,
  ReservationTypeormEntity
> {
  constructor(protected readonly dataSource: DataSource) {
    super(dataSource, ReservationTypeormEntity);
  }

  /**
   * Finds reservations that overlap with the given time range in a specific room.
   *
   * This function checks if there are any existing reservations in the same room
   * where the time period overlaps with the requested start and end time.
   *
   * A reservation is considered overlapping if:
   * - It starts before the new reservation ends.
   * - It ends after the new reservation starts.
   *
   * @param {string} roomId - The ID of the room to check for overlapping reservations.
   * @param {Date} startTime - The start time of the new reservation.
   * @param {Date} endTime - The end time of the new reservation.
   * @returns {Promise<ReservationEntity[]>} A list of overlapping reservations, if any.
   */
  public async findOverlappingReservations(
    roomId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<ReservationEntity[]> {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    // Busca por reservas no mesmo intervalo de sala
    return await this.ormRepository.find({
      where: {
        room: { id: roomId },
        startTime: LessThan(new Date(end)), // Reserva inicia antes do fim da nova
        endTime: MoreThan(new Date(start)), // Reserva termina depois do início da nova
      },
    });
  }

  public async findReservationByUserEmail(email: string) {
    return await this.ormRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .where('user.email = :email', { email })
      .getMany();
  }
}
