import { Injectable } from '@nestjs/common';
import {
  PhoneNumber,
  PhoneNumberFormat,
  PhoneNumberUtil,
} from 'google-libphonenumber';

@Injectable()
export class PhoneService {
  private phoneUtil = PhoneNumberUtil.getInstance();

  isValid(phoneNumber: string, countryCode?: string): boolean {
    const parsedNumber = this.phoneUtil.parseAndKeepRawInput(phoneNumber);

    if (countryCode) {
      return this.phoneUtil.isValidNumberForRegion(parsedNumber, countryCode);
    }

    return this.phoneUtil.isValidNumber(parsedNumber);
  }

  parseToFormat(
    phoneNumber: string,
    format: PhoneNumberFormat = PhoneNumberFormat.E164,
  ) {
    const parsedNumber = this.phoneUtil.parseAndKeepRawInput(phoneNumber);
    return this.phoneUtil.format(parsedNumber, format);
  }
}
