import { BadRequestException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotInThePast', async: false })
export class IsNotInThePast implements ValidatorConstraintInterface {
  validate(startTime: string): boolean {
    const currentTime = new Date().getTime();
    const startTimeInMillis = new Date(startTime).getTime();

    if (startTimeInMillis < currentTime) {
      throw new BadRequestException('Reservation cannot be in the past.');
    }

    return true;
  }
}
