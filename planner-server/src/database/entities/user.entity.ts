import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Task } from '@/src/database/entities/task.entity';
import { TimeBlock } from '@/src/database/entities/timeBlock.entity';
import { PomodoroSession } from '@/src/database/entities/pomodoroSession';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'work_interval', default: 50 })
  workInterval: number;

  @Column({ name: 'break_interval', default: 10 })
  breakInterval: number;

  @Column({ name: 'interval_count', default: 7 })
  intervalCount: number;

  @OneToMany(() => Task, (task) => task.user, { cascade: ['remove'] })
  tasks: Task[];

  @OneToMany(() => TimeBlock, (timeBlock) => timeBlock.user, {
    cascade: ['remove'],
  })
  timeBlocks: TimeBlock[];

  @OneToMany(() => PomodoroSession, (pomodoroSession) => pomodoroSession.user, {
    cascade: ['remove'],
  })
  pomodoroSessions: PomodoroSession[];

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
