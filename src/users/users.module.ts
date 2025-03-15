import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository, UserTypeormRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UsersService,
    {
      provide: UserRepository,
      useClass: UserTypeormRepository,
    },
  ],
  exports: [UsersService, UserRepository],
  controllers: [UsersController],
})
export class UsersModule {}
