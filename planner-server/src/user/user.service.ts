import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/src/database/entities/user.entity';
import { LoginDto } from '@/src/auth/login.dto';
import { hash } from 'argon2';
import { RegisterDto } from '@/src/auth/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  getById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  getByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async create(dto: RegisterDto): Promise<User> {
    const user = {
      email: dto.email,
      name: dto.name,
      password: await hash(dto.password),
    };

    return this.userRepository.save(user);
  }
}
