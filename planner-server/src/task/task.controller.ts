import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { TaskService } from '@/src/task/task.service';
import { Auth } from '@/src/auth/auth.decorator';
import { CurrentUser } from '@/src/user/user.decorator';
import { User } from '@/src/database/entities/user.entity';
import { TaskDto } from '@/src/task/task.dto';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('list')
  @Auth()
  async getAll(@CurrentUser('id') id: number) {
    return this.taskService.getAll(id);
  }

  @Get(':id')
  @Auth()
  async getOne(@CurrentUser('id') userId: number, @Param('id') id: number) {
    return this.taskService.getOne(id, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('create')
  @Auth()
  async create(@CurrentUser() user: User, @Body() dto: TaskDto) {
    return this.taskService.create(dto, user);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @Auth()
  async update(
    @CurrentUser('id') userId: number,
    @Body() dto: TaskDto,
    @Param('id') id: number,
  ) {
    return this.taskService.update(dto, id, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @Auth()
  async delete(@CurrentUser('id') userId: number, @Param('id') id: number) {
    return this.taskService.delete(id, userId);
  }
}
