import { UserEntity } from './user.entity';

export type CreateUser = Pick<UserEntity, 'email' | 'name' | 'password'>;

export type FindUser = Partial<UserEntity>;
