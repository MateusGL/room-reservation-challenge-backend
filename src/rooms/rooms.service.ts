import { Injectable, NotFoundException } from '@nestjs/common';
import { RoomEntity } from './room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomRepository } from './rooms.repository';

@Injectable()
export class RoomsService {
  constructor(private readonly roomRepository: RoomRepository) {}

  async create(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
    return await this.roomRepository.create(createRoomDto);
  }

  async findAll(): Promise<RoomEntity[]> {
    return await this.roomRepository.findMany({});
  }

  async findOne(id: string): Promise<RoomEntity> {
    console.log(id);
    const room = await this.roomRepository.find({ id });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<RoomEntity> {
    console.log('update');
    const room = await this.findOne(id);
    Object.assign(room, updateRoomDto);
    return await this.roomRepository.save(room);
  }

  async remove(id: string): Promise<void> {
    const room = await this.findOne(id);
    await this.roomRepository.delete(room.id);
  }
}
