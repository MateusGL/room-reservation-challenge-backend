import { IsDateString, IsUUID, Validate } from 'class-validator';
import { IsEndTimeAfterStartTime } from '../validators/isEndTimeAfterStartTime.validator';
import { IsDurationValid } from '../validators/isDurationValid.validator';
import { IsNotInThePast } from '../validators/isNotInThePast.validator';

export class CreateReservationDto {
  @IsDateString()
  startTime: Date;

  @IsDateString()
  @Validate(IsEndTimeAfterStartTime, ['startTime']) // Valida que endTime > startTime
  endTime: Date;

  @IsUUID()
  roomId: string;

  @Validate(IsDurationValid)
  checkDuration: string;

  @Validate(IsNotInThePast)
  checkStartTime: string;
}
