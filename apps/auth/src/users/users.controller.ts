import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '@app/common';
import { JwtAuthGuard } from '../guards';
import { CreateUserDto } from './dto';
import { UserDocument } from './models';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getUsers(
    @CurrentUser() user: UserDocument,
  ): Promise<UserDocument> {
    return user;
  }

  @Post()
  public async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserDocument> {
    return this.usersService.create(createUserDto);
  }
}
