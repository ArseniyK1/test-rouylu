import { Transform } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

export class UserFilterDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  efficiency?: string;
}
