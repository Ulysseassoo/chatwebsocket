import { AuthGuard } from './../auth/auth.guard';
import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateColorDto } from 'src/dto/users.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @UseGuards(AuthGuard)
  @Patch('profile')
  @UseInterceptors(
    FileInterceptor('profilePhoto', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateProfile(
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateProfileDto.profilePhoto = `/uploads/${file.filename}`;
    }
    return this.usersService.updateProfile(req.user.sub, updateProfileDto);
  }
}
