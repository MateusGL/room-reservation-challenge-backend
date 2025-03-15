import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../@common/domain/base.repository';
import { BaseTypeormRepository } from 'src/@common/domain/base.typeorm.repository';
import { DataSource } from 'typeorm';
import { RoomEntity } from './room.entity';
import { RoomTypeormEntity } from './room-typeorm.entity';
import { CreateRoom, FindRoom } from './room.interface';

export class RoomRepository extends BaseRepository<
  RoomEntity,
  CreateRoom,
  FindRoom
> {}

@Injectable()
export class RoomTypeormRepository extends BaseTypeormRepository<
  RoomEntity,
  CreateRoom,
  FindRoom,
  RoomTypeormEntity
> {
  constructor(protected readonly dataSource: DataSource) {
    super(dataSource, RoomTypeormEntity);
  }
}
