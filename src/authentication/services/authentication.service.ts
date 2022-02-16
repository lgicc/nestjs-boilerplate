import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { argon2id, verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  async login(user: User): Promise<{
    refresh_token_created_at: Date;
    access_token: string;
    refresh_token: string;
  }> {
    const iatDate = new Date();
    const iat = Math.floor(iatDate.getTime() / 1000);

    const payload = {
      sub: user.email,
      aud: 'client',
      iss: 'server',
      iat: iat,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: this.config.get<number>('jwtTokenExpireTime'),
        secret: this.config.get<string>('secrets.jwt'),
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: this.config.get<number>('refreshTokenExpireTime'),
        secret: this.config.get<string>('secrets.refreshToken'),
      }),
      refresh_token_created_at: iatDate,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      return null;
    }

    if (
      await verify(
        user.password,
        password + this.config.get<string>('secrets.password'),
        { type: argon2id },
      )
    ) {
      return user;
    }

    return null;
  }
}
