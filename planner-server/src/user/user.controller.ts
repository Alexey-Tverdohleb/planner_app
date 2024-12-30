import {
  Body,
  Controller,
  Get,
  HttpCode,
  Put,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from '@/src/auth/auth.decorator';
import { CurrentUser } from '@/src/user/user.decorator';
import { UserService } from '@/src/user/user.service';
import { UserDto } from '@/src/user/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @Auth()
  async profile(@CurrentUser('id') id: number) {
    return this.userService.getProfile(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Put()
  @Auth()
  async update(@CurrentUser('id') id: number, @Body() dto: UserDto) {
    return this.userService.update(id, dto);
  }
}
