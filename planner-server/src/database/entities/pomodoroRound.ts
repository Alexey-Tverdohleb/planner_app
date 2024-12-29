import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { PomodoroSession } from '@/src/database/entities/pomodoroSession';

@Entity({ name: 'pomodoro_round' })
export class PomodoroRound {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_complete', default: false })
  isComplete: boolean;

  @Column({ name: 'total_session' })
  totalSession: number;

  @ManyToOne(
    () => PomodoroSession,
    (pomodoroSession) => pomodoroSession.pomodoroRounds,
  )
  pomodoroSession: PomodoroSession;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
