import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskPriority } from '@/types/enums';
import { Transform } from 'class-transformer';

export class TaskDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsEnum(TaskPriority)
  @Transform(({ value }) => String(value).toLowerCase())
  priority?: TaskPriority;
}
