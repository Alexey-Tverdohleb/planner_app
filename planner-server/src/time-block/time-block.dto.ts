import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class TimeBlockDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsNumber()
  duration: number;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateOrderDto {
  @IsArray()
  ids: number[];
}
