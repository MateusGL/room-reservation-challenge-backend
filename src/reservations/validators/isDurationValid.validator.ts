import { BadRequestException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Custom validation constraint for duration
@ValidatorConstraint({ name: 'isDurationValid', async: false })
export class IsDurationValid implements ValidatorConstraintInterface {
  validate(startTime: string, args: any): boolean {
    const { object } = args;
    const endTime = object.endTime;

    if (startTime && endTime) {
      const duration =
        (new Date(endTime).getTime() - new Date(startTime).getTime()) /
        (1000 * 60 * 60);

      if (duration < 1) {
        throw new BadRequestException('Reservation must be at least 1 hour.');
      }
    }
    return true;
  }
}
