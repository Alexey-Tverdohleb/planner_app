import { Module } from '@nestjs/common';

import { TimerController } from '@/src/timer/timer.controller';
import { TimerService } from '@/src/timer/timer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PomodoroSession } from '@/src/database/entities/pomodoroSession';
import { UserModule } from '@/src/user/user.module';
import { PomodoroRound } from '@/src/database/entities/pomodoroRound';

@Module({
  imports: [
    TypeOrmModule.forFeature([PomodoroSession, PomodoroRound]),
    UserModule,
  ],
  controllers: [TimerController],
  providers: [TimerService],
})
export class TimerModule {}
