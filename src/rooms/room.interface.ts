import { RoomEntity } from './room.entity';

export type CreateRoom = Pick<RoomEntity, 'name' | 'capacity'>;

export type FindRoom = Partial<RoomEntity>;
