import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local.guard';
import { AuthenticationService } from '../services/authentication.service';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { FastifyReply } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { PasswordService } from '../services/password.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import configuration from '../../configuration';

@Controller()
export class LoginController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authenticationService: AuthenticationService,
    private passwordService: PasswordService,
    private config: ConfigService,
  ) {}

  @Get('fixtures/user')
  async userFixture(@Req() req, @Res({ passthrough: true }) res: FastifyReply) {
    if (configuration().production) {
      res.code(404);
      return {};
    }

    const user = new User();
    user.isAdmin = true;
    user.password = await this.passwordService.encode('1');
    user.email = '1';
    user.phoneNumber = '491723721322';

    return this.userRepository.save(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('api/v1/login')
  async login(@Req() req, @Res({ passthrough: true }) res: FastifyReply) {
    return this.loginUser(req, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('api/v1/refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: FastifyReply) {
    return this.loginUser(req, res);
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(201)
  @Get('api/v1/logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: FastifyReply) {
    res.clearCookie('refresh_token');
  }

  private async loginUser(req, res) {
    const credentials = await this.authenticationService.login(req.user);

    res.setCookie(
      'refresh_token',
      Buffer.from(credentials.refresh_token, 'utf-8').toString('base64'),
      {
        httpOnly: true,
        secure: this.config.get<boolean>('production'),
        path: '/api/v1/refresh',
        signed: true,
        expires: new Date(
          credentials.refresh_token_created_at.getTime() +
            this.config.get<number>('refreshTokenExpireTime'),
        ),
      },
    );

    return {
      access_token: credentials.access_token,
    };
  }
}
