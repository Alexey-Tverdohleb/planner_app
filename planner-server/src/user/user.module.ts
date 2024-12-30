import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '@/src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/src/database/entities/user.entity';
import { Task } from '@/src/database/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Task]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
