import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class UpdateRoomDto {
  @IsString()
  @MinLength(3)
  name?: string;

  @IsInt()
  @Min(1)
  capacity?: number;
}
