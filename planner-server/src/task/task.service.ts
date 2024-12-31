import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Task } from '@/src/database/entities/task.entity';
import { TaskDto } from '@/src/task/task.dto';
import { User } from '@/src/database/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly TaskRepository: Repository<Task>,
  ) {}

  async getAll(userId: number): Promise<Task[]> {
    return this.TaskRepository.find({
      where: {
        user: { id: userId },
      },
    });
  }

  async getOne(id: number): Promise<Task> {
    return this.TaskRepository.findOne({ where: { id } });
  }

  async create(dto: TaskDto, user: User): Promise<Task> {
    return this.TaskRepository.save({ ...dto, user });
  }

  async update(dto: Partial<TaskDto>, taskId: number): Promise<Task> {
    await this.TaskRepository.update({ id: taskId }, dto);

    return this.getOne(taskId);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.TaskRepository.delete({ id });
  }
}
