import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies?.refresh_token;
    if(token) {
      token = Buffer.from(token, 'base64').toString('utf-8')
    }
  }

  return token;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refreshToken'
) {
  constructor(
    private config: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: config.get<string>('secrets.refreshToken')
    });
  }

  async validate(payload: any): Promise<any> {
    const user = await this.userRepository.findOne({ email: payload.sub });

    if (!user) {
      throw new UnauthorizedException({
        code: '',
        message: 'Unauthorized'
      });
    }

    return user;
  }
}
