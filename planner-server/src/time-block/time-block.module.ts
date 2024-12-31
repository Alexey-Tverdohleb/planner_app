import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TimeBlock } from '@/src/database/entities/timeBlock.entity';
import { TimeBlockController } from '@/src/time-block/time-block.controller';
import { TimeBlockService } from '@/src/time-block/time-block.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimeBlock])],
  controllers: [TimeBlockController],
  providers: [TimeBlockService],
})
export class TimeBlockModule {}
