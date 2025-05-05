import { AuthGuard } from './../auth/auth.guard';
import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateColorDto } from 'src/dto/users.dto';
import { User } from 'generated/prisma';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Patch('color')
  updateColor(@Req() req, @Body() updateColorDto: UpdateColorDto) {
    return this.usersService.updateColor(req.user.id, updateColorDto.color);
  }
}
