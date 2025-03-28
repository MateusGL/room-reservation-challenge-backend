import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationEntity } from './reservation.entity';
import { RoomRepository } from '../rooms/rooms.repository';
import { UserRepository } from '../users/users.repository';
import {
  CreateReservation,
  RelationsReservation,
} from './reservation.interface';
import { JwtPayload } from 'src/auth/auth.interface';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private roomRepository: RoomRepository,
    private userRepository: UserRepository,
  ) {}

  private validateReservationTimes(startTime: Date, endTime: Date): void {
    const now = new Date();

    if (new Date(startTime) < now || new Date(endTime) < now) {
      throw new BadRequestException('Reservations cannot be in the past.');
    }

    if (new Date(endTime) <= new Date(startTime)) {
      throw new BadRequestException('End time must be after start time.');
    }

    const durationMs =
      new Date(endTime).getTime() - new Date(startTime).getTime();
    const ONE_HOUR = 60 * 60 * 1000;

    if (durationMs < ONE_HOUR) {
      throw new BadRequestException(
        'The reservation must be at least 1 hour long.',
      );
    }
  }

  private async validateNoOverlappingReservations(
    roomId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<void> {
    const overlapping =
      await this.reservationRepository.findOverlappingReservations(
        roomId,
        startTime,
        endTime,
      );

    if (overlapping.length > 0) {
      throw new BadRequestException(
        'There are overlapping reservations for this room.',
      );
    }
  }

  async create(
    createReservationDto: CreateReservationDto,
    jwtPayload: JwtPayload,
  ): Promise<ReservationEntity> {
    this.validateReservationTimes(
      createReservationDto.startTime,
      createReservationDto.endTime,
    );

    await this.validateNoOverlappingReservations(
      createReservationDto.roomId,
      createReservationDto.startTime,
      createReservationDto.endTime,
    );

    const room = await this.roomRepository.find({
      id: createReservationDto.roomId,
    });
    const user = await this.userRepository.find({
      email: jwtPayload.email,
    });

    if (!room || !user) {
      throw new BadRequestException('Invalid room or user.');
    }

    const reservation: CreateReservation = {
      startTime: createReservationDto.startTime,
      endTime: createReservationDto.endTime,
      room: room,
      user: user,
    };

    const newReservation = await this.reservationRepository.create(reservation);
    return await this.reservationRepository.save(newReservation);
  }

  async findOne(
    id: string,
    relations?: RelationsReservation,
  ): Promise<ReservationEntity> {
    const reservation = await this.reservationRepository.find(
      { id },
      relations,
    );
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found.`);
    }
    return reservation;
  }

  async findAll(): Promise<ReservationEntity[]> {
    const reservations = await this.reservationRepository.findMany({}, [
      'room',
      'user',
    ]);
    return reservations;
  }

  async findReservationByEmail(email: string) {
    return await this.reservationRepository.findReservationByUserEmail(email);
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<ReservationEntity> {
    this.validateReservationTimes(
      updateReservationDto.startTime,
      updateReservationDto.endTime,
    );

    const reservation = await this.findOne(id, ['room']);

    const updatedReservation = { ...reservation, ...updateReservationDto };

    await this.validateNoOverlappingReservations(
      reservation.room.id,
      updatedReservation.startTime,
      updatedReservation.endTime,
    );

    await this.reservationRepository.save({
      ...updatedReservation,
      room: reservation.room,
    });
    return updatedReservation;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.reservationRepository.delete(id);
  }
}
