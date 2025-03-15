import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../@common/domain/base.repository';
import { UserEntity } from './user.entity';
import { CreateUser, FindUser } from './users.interface';
import { BaseTypeormRepository } from 'src/@common/domain/base.typeorm.repository';
import { UserTypeormEntity } from './users-typeorm.entity';
import { DataSource } from 'typeorm';

export class UserRepository extends BaseRepository<
  UserEntity,
  CreateUser,
  FindUser
> {}

@Injectable()
export class UserTypeormRepository extends BaseTypeormRepository<
  UserEntity,
  CreateUser,
  FindUser,
  UserTypeormEntity
> {
  constructor(protected readonly dataSource: DataSource) {
    super(dataSource, UserTypeormEntity);
  }
}
