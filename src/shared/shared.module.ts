import { Module } from '@nestjs/common';
import { PhoneService } from './services/phone.service';

@Module({
  providers: [PhoneService]
})
export class SharedModule {}
