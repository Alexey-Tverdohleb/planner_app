import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from '@/src/database/entities/user.entity';
import { PomodoroRound } from '@/src/database/entities/pomodoroRound';

@Entity({ name: 'pomodoro_session' })
export class PomodoroSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_complete', default: false })
  isComplete: boolean;

  @ManyToOne(() => User, (user) => user)
  user: User;

  @OneToMany(
    () => PomodoroRound,
    (pomodoroRound) => pomodoroRound.pomodoroSession,
    { onDelete: 'CASCADE' },
  )
  pomodoroRounds: PomodoroRound[];

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
