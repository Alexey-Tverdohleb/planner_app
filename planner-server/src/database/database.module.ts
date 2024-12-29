import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from '@/src/database/entities/user.entity';
import { Task } from '@/src/database/entities/task.entity';
import { TimeBlock } from '@/src/database/entities/timeBlock.entity';
import { PomodoroSession } from '@/src/database/entities/pomodoroSession';
import { PomodoroRound } from '@/src/database/entities/pomodoroRound';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [User, Task, TimeBlock, PomodoroSession, PomodoroRound],
          synchronize: configService.get('MODE') === 'development',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
