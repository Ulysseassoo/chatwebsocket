import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'generated/prisma';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async create(createUserDto: {
    username: string;
    password: string;
    color?: string;
  }): Promise<User> {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(createUserDto.password, salt);

    return this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password,
        color: createUserDto.color,
      },
    });
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async updateColor(id: number, color: string): Promise<Omit<User, 'password'>> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { color },
    });

    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  async updateProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Omit<User, 'password'>> {
    const updateData: any = {};

    if (updateProfileDto.color) {
      updateData.color = updateProfileDto.color;
    }

    if (updateProfileDto.profilePhoto) {
      updateData.profilePhoto = updateProfileDto.profilePhoto;
    }

    if (updateProfileDto.currentPassword && updateProfileDto.newPassword) {
      const user = await this.findById(id);
      const isPasswordValid = await bcrypt.compare(updateProfileDto.currentPassword, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateProfileDto.newPassword, salt);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async findByIdFromToken(token: string): Promise<User | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (!payload?.sub) return null;
      return this.findById(payload.sub);
    } catch {
      return null;
    }
  }
}
