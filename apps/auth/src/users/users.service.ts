import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto, GetUserDto } from './dto';
import { UserDocument } from './models';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    await this.validateCreateUserDto(createUserDto);
    return this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  private async validateCreateUserDto(
    createUserDto: CreateUserDto,
  ): Promise<void> {
    try {
      await this.userRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists.');
  }

  public async verifyUser(
    email: string,
    password: string,
  ): Promise<UserDocument> {
    const user = await this.userRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  public async getUser(getUserDto: GetUserDto): Promise<UserDocument> {
    return this.userRepository.findOne(getUserDto);
  }
}
