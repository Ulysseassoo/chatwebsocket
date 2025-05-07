import { AuthGuard } from './../auth/auth.guard';
import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateColorDto } from 'src/dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    const userId = req.user.sub;
    const { password, ...user } = await this.usersService.findById(userId);
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch('color')
  updateColor(@Req() req, @Body() updateColorDto: UpdateColorDto) {
    return this.usersService.updateColor(req.user.sub, updateColorDto.color);
  }
}
