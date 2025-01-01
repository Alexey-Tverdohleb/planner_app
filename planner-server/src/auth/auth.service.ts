import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '@/src/auth/login.dto';
import { verify } from 'argon2';
import { RegisterDto } from '@/src/auth/register.dto';
import { omitKey } from '@/helpers/unility.helpers';
import { Response } from 'express';

@Injectable()
export class AuthService {
  readonly EXPIRE_DAY_REFRESH_TOKEN = 1;
  readonly REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existedUser = await this.userService.getByEmail(dto.email);

    if (existedUser) {
      throw new UnauthorizedException('User already exists');
    }

    const userObject = await this.userService.create(dto);
    const user = omitKey(userObject, 'password');
    const tokens = this.issueToken(user.id);

    return { user, ...tokens };
  }

  async login(dto: LoginDto) {
    const userObject = await this.validateUser(dto);
    const user = omitKey(userObject, 'password');

    const tokens = this.issueToken(user.id);

    return {
      user,
      ...tokens,
    };
  }

  private issueToken(userId: number) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, { expiresIn: '1h' });
    const refreshToken = this.jwt.sign(data, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: LoginDto) {
    const user = await this.userService.getByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = await verify(user.password, dto.password);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return user;
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    return res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: 'localhost',
      expires: expiresIn,
      sameSite: 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    return res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: 'localhost',
      expires: new Date(0),
      sameSite: 'none',
    });
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);

    if (!result) {
      throw new UnauthorizedException('Refresh Token is not Valid');
    }

    const userObject = await this.userService.getById(result.id);
    const user = omitKey(userObject, 'password');
    const tokens = this.issueToken(user.id);

    return {
      user,
      ...tokens,
    };
  }
}
