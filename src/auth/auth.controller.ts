import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { StartRegistrationResponseDto } from './dtos/start-registration-response.dto.js';
import { StartRegistrationDto } from './dtos/start-registration.dto.js';
import { FinishRegistrationDto } from './dtos/finish-registration.dto.js';
import { FinishRegistrationResponseDto } from './dtos/finish-registration-response.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('start-registration')
  async startRegistration(
    @Body() payload: StartRegistrationDto,
  ): Promise<StartRegistrationResponseDto> {
    return this.service.startRegistration(payload);
  }

  @Post('finish-registration')
  async finishRegistration(
    @Body() payload: FinishRegistrationDto,
  ): Promise<FinishRegistrationResponseDto> {
    return this.service.finishRegistration(payload);
  }
}
