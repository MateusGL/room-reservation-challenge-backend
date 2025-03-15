import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsEndTimeAfterStartTime(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isEndTimeAfterStartTime',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [startTimeField] = args.constraints;
          const startTime = (args.object as any)[startTimeField];

          if (!startTime || !value) return true;

          return new Date(value) > new Date(startTime);
        },
        defaultMessage(args: ValidationArguments) {
          return `"${args.property}" must be later than "${args.constraints[0]}"`;
        },
      },
    });
  };
}
