import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeBlock } from '@/src/database/entities/timeBlock.entity';
import { DataSource, Repository } from 'typeorm';
import { TimeBlockDto, UpdateOrderDto } from '@/src/time-block/time-block.dto';
import { User } from '@/src/database/entities/user.entity';

@Injectable()
export class TimeBlockService {
  constructor(
    @InjectRepository(TimeBlock)
    private readonly TimeBlockRepository: Repository<TimeBlock>,
    private readonly dataSource: DataSource,
  ) {}
  async getAll(userId: number): Promise<TimeBlock[]> {
    return this.TimeBlockRepository.find({
      where: { user: { id: userId } },
    });
  }

  async getOne(id: number, userId: number) {
    return this.TimeBlockRepository.findOne({
      where: { id, user: { id: userId } },
    });
  }

  async create(dto: TimeBlockDto, user: User): Promise<TimeBlock> {
    return this.TimeBlockRepository.save({ ...dto, user });
  }

  async update(
    id: number,
    dto: Partial<TimeBlockDto>,
    userId: number,
  ): Promise<TimeBlock> {
    await this.TimeBlockRepository.update({ id, user: { id: userId } }, dto);

    return this.getOne(id, userId);
  }

  async delete(id: number, userId: number): Promise<number> {
    await this.TimeBlockRepository.delete({ id, user: { id: userId } });

    return id;
  }

  async changeOrder(ids: number[], userId: number): Promise<TimeBlock[]> {
    await this.dataSource.transaction(async (entityManager) => {
      const updatePromises = ids.map((id, index) =>
        entityManager.update(
          TimeBlock,
          { id, user: { id: userId } },
          { order: index + 1 },
        ),
      );
      await Promise.all(updatePromises);
    });

    return this.getAll(userId);
  }
}
