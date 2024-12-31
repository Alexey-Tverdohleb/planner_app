import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Auth } from '@/src/auth/auth.decorator';
import { TimeBlockService } from '@/src/time-block/time-block.service';
import { CurrentUser } from '@/src/user/user.decorator';
import { User } from '@/src/database/entities/user.entity';
import { TimeBlockDto, UpdateOrderDto } from '@/src/time-block/time-block.dto';

@Controller('time-block')
export class TimeBlockController {
  constructor(private readonly timeBlockService: TimeBlockService) {}
  @Get('list')
  @Auth()
  async getAll(@CurrentUser('id') id: number) {
    return this.timeBlockService.getAll(id);
  }

  @Get(':id')
  @Auth()
  async getOne(@CurrentUser('id') userId: number, @Param('id') id: number) {
    return this.timeBlockService.getOne(id, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('create')
  @Auth()
  async create(@CurrentUser() user: User, @Body() dto: TimeBlockDto) {
    return this.timeBlockService.create(dto, user);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @Auth()
  async update(
    @CurrentUser('id') userId: number,
    @Param() id: number,
    @Body() dto: TimeBlockDto,
  ) {
    return this.timeBlockService.update(id, dto, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Put('update-order')
  @Auth()
  async updateOrder(
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.timeBlockService.changeOrder(dto.ids, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @Auth()
  async delete(@CurrentUser('id') userId: number, @Param('id') id: number) {
    return this.timeBlockService.delete(id, userId);
  }
}
