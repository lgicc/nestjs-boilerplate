import { Injectable } from '@nestjs/common';
import { argon2id, hash } from 'argon2';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PasswordService {
    constructor(
        private config: ConfigService
    ) {}

    encode(password: string): Promise<string> {
        return hash(password + this.config.get<string>('secrets.password'), {
            type: argon2id
        });
    }
}
