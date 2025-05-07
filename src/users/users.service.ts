import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'generated/prisma';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
}
