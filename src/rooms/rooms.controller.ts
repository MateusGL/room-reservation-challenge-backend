import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';

import { RoomEntity } from './room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto): Promise<RoomEntity> {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  async findAll(): Promise<RoomEntity[]> {
    return this.roomsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RoomEntity> {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<RoomEntity> {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.roomsService.remove(id);
  }
}
