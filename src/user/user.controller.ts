import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CommonResponse } from 'src/common/common.response';
import { User } from './entities/user.entity';
import { UserFilterDto } from './dto/user-filter.dto';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CommonResponse<{ id: number }>> {
    const result = await this.userService.create(createUserDto);

    if (!result.success) {
      throw new BadRequestException(result.result);
    }

    return result;
  }

  @Get(['get', 'get/:id'])
  async get(
    @Param('id') id?: string,
    @Query() filters?: UserFilterDto,
  ): Promise<CommonResponse<{ users: User[] }>> {
    const numId = id ? parseInt(id) : undefined;
    return this.userService.getUsers(numId, filters);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto,
  ): Promise<CommonResponse<User>> {
    return this.userService.updateUser(parseInt(id), updateData);
  }

  @Delete(['delete', 'delete/:id'])
  async delete(
    @Param('id') id?: string,
  ): Promise<CommonResponse<User | undefined>> {
    const numId = id ? parseInt(id) : undefined;
    return this.userService.deleteUser(numId);
  }
}
