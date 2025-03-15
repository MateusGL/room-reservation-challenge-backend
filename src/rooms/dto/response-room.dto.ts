import { IsInt, IsString, IsUUID } from 'class-validator';

export class RoomResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsInt()
  capacity: number;
}
