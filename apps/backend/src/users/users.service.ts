import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    const userData: any = {
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: hashedPassword,
      mustChangePassword: true,
    };

    if (createUserDto.roleId) {
      userData.roleId = createUserDto.roleId;
    }

    if (createUserDto.departmentId) {
      userData.departmentId = createUserDto.departmentId;
    }

    return this.prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        roleId: true,
        departmentId: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        role: true,
        department: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        department: true,
      },
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async updateUser(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      roleId?: string;
      departmentId?: string;
    },
  ) {
    await this.findById(id);

    if (data.email) {
      const existing = await this.prisma.user.findFirst({
        where: { email: data.email, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException('Email already in use');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        role: true,
        department: true,
      },
    });
  }

  async toggleUserStatus(id: string) {
    const user = await this.findById(id);
    return this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      include: {
        role: true,
        department: true,
      },
    });
  }

  async changePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
      },
    });
  }

  async resetPassword(id: string, newPassword: string) {
    await this.findById(id);
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        mustChangePassword: true,
      },
    });
  }
}
