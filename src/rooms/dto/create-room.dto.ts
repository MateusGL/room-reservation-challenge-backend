import { IsString, MinLength, IsInt, Min } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsInt()
  @Min(1)
  capacity: number;
}
