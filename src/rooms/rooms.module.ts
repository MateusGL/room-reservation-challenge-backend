import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomRepository, RoomTypeormRepository } from './rooms.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './room.entity';
import { RoomsController } from './rooms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity])],
  providers: [
    RoomsService,
    {
      provide: RoomRepository,
      useClass: RoomTypeormRepository,
    },
  ],
  exports: [RoomsService, RoomRepository],
  controllers: [RoomsController],
})
export class RoomsModule {}
