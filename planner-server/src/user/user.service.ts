import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, Between } from 'typeorm';
import { User } from '@/src/database/entities/user.entity';
import { Task } from '@/src/database/entities/task.entity';
import { hash } from 'argon2';
import { RegisterDto } from '@/src/auth/register.dto';
import { UserDto } from '@/src/user/user.dto';

import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { omitKey } from '@/helpers/unility.helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}
  async getById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async getProfile(id: number) {
    const userObject = await this.userRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });
    const user = omitKey(userObject, 'password');

    const totalTasks = user.tasks.length;

    const completedTasks = user.tasks.filter(
      ({ is_completed }) => is_completed,
    ).length;

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const todayTasks = await this.taskRepository.find({
      where: { user: { id }, createdAt: Between(todayStart, todayEnd) },
      relations: ['user'],
    });

    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());

    const weekTasks = await this.taskRepository.find({
      where: { user: { id }, createdAt: Between(weekStart, weekEnd) },
      relations: ['user'],
    });

    return {
      user,
      statistics: [
        { label: 'Total Tasks', value: totalTasks },
        { label: 'Completed Tasks', value: completedTasks },
        { label: 'Today Tasks', value: todayTasks },
        { label: 'Week Tasks', value: weekTasks },
      ],
    };
  }

  async create(dto: RegisterDto): Promise<User> {
    const user = {
      email: dto.email,
      name: dto.name,
      password: await hash(dto.password),
    };

    return this.userRepository.save(user);
  }

  async update(id: number, dto: UserDto): Promise<User> {
    const data = { ...dto };

    if (dto.password) {
      data.password = await hash(dto.password);
    }

    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ ...data })
      .where('id = :id', { id })
      .execute();

    return await this.userRepository.findOne({ where: { id } });
  }
}
