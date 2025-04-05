import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateUserDto extends OmitType(User, ['id'] as const) {
  @IsString({ message: 'Поле full_name должно быть типа VARCHAR' })
  @IsNotEmpty({ message: 'Поле full_name не должно быть пустым' })
  full_name: string;

  @IsString({ message: 'Поле role должно быть типа VARCHAR' })
  @IsNotEmpty({ message: 'Поле role не должно быть пустым' })
  role: string;

  @IsInt({ message: 'Поле efficiency должно быть типа INTEGER' })
  @IsNotEmpty({ message: 'Поле efficiency не должно быть пустым' })
  @Min(0, { message: 'Поле efficiency должно быть не менее 0' })
  efficiency: number;
}
