import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class PomodoroSessionDto {
  @IsOptional()
  @IsBoolean()
  isComplete?: boolean;
}

export class PomodoroRoundDto {
  @IsNumber()
  totalSeconds: number;

  @IsOptional()
  @IsBoolean()
  isComplete?: boolean;
}
