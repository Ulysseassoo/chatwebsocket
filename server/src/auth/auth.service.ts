import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export interface JwtPayload {
  sub: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    try {
      const user = await this.usersService.findByUsername(username);

      if (!user) {
        return null;
      }

      const isValid = await bcrypt.compare(pass, user.password);
      if (!isValid) {
        return null;
      }

      const { password, ...rest } = user;
      return rest;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
      throw error;
    }
  }

  async login(loginDto: { username: string; password: string }) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string) {
    try {
      const existingUser = await this.usersService.findByUsername(username);
      if (existingUser) {
        throw new ConflictException(`Username is already taken`);
      }
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    await this.usersService.create({ username, password });

    return {
      success: true,
      message: 'User registered successfully',
    };
  }
}
