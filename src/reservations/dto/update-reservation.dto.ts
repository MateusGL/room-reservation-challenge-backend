import { IsDateString, Validate } from 'class-validator';
import { IsEndTimeAfterStartTime } from '../validators/isEndTimeAfterStartTime.validator';

export class UpdateReservationDto {
  @IsDateString()
  startTime: Date;

  @IsDateString()
  @Validate(IsEndTimeAfterStartTime, ['startTime']) // Valida que endTime > startTime
  endTime: Date;
}
