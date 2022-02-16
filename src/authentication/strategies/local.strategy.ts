import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthenticationService } from '../services/authentication.service';
import { Strategy } from 'passport-local';
import { User } from '../entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authenticationService.validateUser(
      username,
      password
    );

    if (!user) {
      throw new UnauthorizedException({
        code: '',
        message: 'Unauthorized'
      });
    }

    return user;
  }
}
