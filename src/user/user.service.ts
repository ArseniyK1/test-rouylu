import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from './entities/user.entity';
import { CommonResponse } from 'src/common/common.response';
import { Prisma } from '@prisma/client';
import { UserFilterDto } from './dto/user-filter.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<CommonResponse<{ id: number }>> {
    try {
      const new_user = await this.prisma.user.create({ data: dto });
      return {
        success: true,
        result: { id: new_user.id },
      };
    } catch (e) {
      return {
        success: false,
        result: {
          error: e || 'Произошла неизвестная ошибка при создании пользователя',
        },
      };
    }
  }

  async getUsers(
    id?: number,
    filters?: UserFilterDto,
  ): Promise<CommonResponse<{ users: User[] }>> {
    try {
      const where: Prisma.userWhereInput = {};

      if (id) {
        where.id = id;
      }

      if (filters) {
        if (filters.full_name) {
          where.full_name = {
            contains: filters.full_name,
          };
        }

        if (filters.role) {
          where.role = filters.role;
        }

        if (!!filters.efficiency) {
          where.efficiency = +filters.efficiency;
        }
      }

      const users: User[] = await this.prisma.user.findMany({
        where,
        select: {
          id: true,
          full_name: true,
          role: true,
          efficiency: true,
        },
      });

      if (id && users.length === 0) {
        return {
          success: false,
          result: {
            error: 'Пользователь не найден',
          },
        };
      }

      if (users?.length === 0) {
        return {
          success: false,
          result: { error: 'Пользователь не найден' },
        };
      }

      return {
        success: true,
        result: { users },
      };
    } catch (e) {
      return {
        success: false,
        result: {
          error: 'Произошла ошибка при получении пользователей',
        },
      };
    }
  }

  async updateUser(
    id: number,
    updateData: UpdateUserDto,
  ): Promise<CommonResponse<User>> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateData,
      });

      return {
        success: true,
        result: updatedUser,
      };
    } catch (e) {
      return {
        success: false,
        result: {
          error: 'Произошла ошибка при обновлении данных пользователя',
        },
      };
    }
  }

  async deleteUser(id?: number): Promise<CommonResponse<User | undefined>> {
    try {
      if (id) {
        const deletedUser = await this.prisma.user.delete({
          where: { id },
        });
        return {
          success: true,
          result: deletedUser,
        };
      } else {
        await this.prisma.user.deleteMany();
        return {
          success: true,
          result: undefined,
        };
      }
    } catch (e) {
      return {
        success: false,
        result: {
          error: 'Произошла ошибка при удалении',
        },
      };
    }
  }
}
