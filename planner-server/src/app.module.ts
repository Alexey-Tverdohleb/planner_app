import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from '@/src/task/task.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
