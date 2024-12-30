import { Injectable } from '@nestjs/common';
import { UserService } from '@/src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from '@/src/auth/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: AuthDto) {
    return dto;
  }
}
