import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../decorators/Public';
import { CreateUserDto } from 'src/dto/users.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    await this.authService.register(body.username, body.password);

    return {
      success: true,
      message: 'User registered successfully',
    };
  }

  @Public()
  @Post('login')
  login(@Body() body: CreateUserDto) {
    return this.authService.login(body);
  }
}
