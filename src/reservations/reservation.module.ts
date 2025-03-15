import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity } from './reservation.entity';
import {
  ReservationRepository,
  ReservationTypeormRepository,
} from './reservation.repository';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations..controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationEntity]),
    UsersModule,
    AuthModule,
    RoomsModule,
  ],
  providers: [
    ReservationsService,
    {
      provide: ReservationRepository,
      useClass: ReservationTypeormRepository,
    },
  ],
  exports: [ReservationsService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
