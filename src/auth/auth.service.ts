import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AuthPackage } from './entities/auth-package.entity.js';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import { StartRegistrationDto } from './dtos/start-registration.dto.js';
import * as opaque from '@serenity-kit/opaque';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { RegistrationResponseDto } from './dtos/registration-response.dto.js';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthPackage)
    private readonly authPackageRepository: EntityRepository<AuthPackage>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly config: ConfigService,
  ) {}

  async startRegistration(
    payload: StartRegistrationDto,
  ): Promise<RegistrationResponseDto> {
    // ensure that a user with this username does not exist
    const user = await this.authPackageRepository.findOne({
      username: payload.username,
    });
    if (user)
      throw new ConflictException({ errors: ['This user already exists.'] });

    // generate registration response
    const serverSetup = this.config.getOrThrow<string>('OPAQUE_SETUP');
    const { registrationResponse } = opaque.server.createRegistrationResponse({
      serverSetup,
      userIdentifier: payload.username,
      registrationRequest: payload.registrationRequest,
    });

    // generate short-lived registration token
    // this is done to ensure that the client is not able to change the username on finishRegistration
    const registrationToken = v4();
    await this.cache.set(
      `registrationState:${payload.username}`,
      { registrationToken },
      10000,
    );

    return { registrationResponse, registrationToken };
  }
}
