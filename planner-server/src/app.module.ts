import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from '@/src/task/task.module';
import { TimeBlockModule } from '@/src/time-block/time-block.module';
import { TimerModule } from '@/src/timer/timer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '~root/.env',
      isGlobal: true,
    }),
    UserModule,
    DatabaseModule,
    AuthModule,
    TaskModule,
    TimeBlockModule,
    TimerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
