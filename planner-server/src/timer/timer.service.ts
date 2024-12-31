import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { startOfDay } from 'date-fns';

import { PomodoroSession } from '@/src/database/entities/pomodoroSession';
import { PomodoroRound } from '@/src/database/entities/pomodoroRound';
import { UserService } from '@/src/user/user.service';

@Injectable()
export class TimerService {
  constructor(
    @InjectRepository(PomodoroSession)
    private readonly PomodoroSessionRepository: Repository<PomodoroSession>,
    @InjectRepository(PomodoroRound)
    private readonly PomodoroRoundRepository: Repository<PomodoroRound>,
    private readonly UserService: UserService,
  ) {}

  async getTodaySession(userId: number): Promise<PomodoroSession | null> {
    const todayStart = startOfDay(new Date());

    return this.PomodoroSessionRepository.findOne({
      where: {
        user: { id: userId },
        createdAt: MoreThan(todayStart),
      },
      relations: ['pomodoroRounds'],
      order: {
        pomodoroRounds: {
          id: 'ASC',
        },
      },
    });
  }

  async createSession(userId: number) {
    const todaySession = await this.getTodaySession(userId);

    if (todaySession) {
      return todaySession;
    }

    const user = this.UserService.getById(userId);

    if (!user) {
      throw new NotFoundException('User does not found');
    }
  }
}
