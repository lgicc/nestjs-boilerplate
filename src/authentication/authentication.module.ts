import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationService } from './services/authentication.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginController } from './controllers/login.controller';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { SharedModule } from '../shared/shared.module';
import { PasswordService } from './services/password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    ConfigModule,
    SharedModule,
    JwtModule.register({}),
  ],
  controllers: [LoginController],
  providers: [
    PasswordService,
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthenticationModule {}
