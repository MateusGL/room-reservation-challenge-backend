import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.find({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.find({ email });
    if (!user) {
      throw new NotFoundException(`User with ID ${email} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.delete(user.id);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.findMany({});
  }

  async create(user: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.find({
      email: user.email,
    });

    if (existingUser) {
      throw new ConflictException('There is already a user with this email');
    }

    return this.userRepository.create(user);
  }
}
