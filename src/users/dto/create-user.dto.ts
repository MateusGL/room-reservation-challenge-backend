import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Length(6, 20, {
    message: 'The password must be between 6 and 20 characters',
  })
  @IsNotEmpty()
  readonly password: string;
}
