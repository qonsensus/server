import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AuthPackage } from './entities/auth-package.entity.js';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import { StartRegistrationDto } from './dtos/start-registration.dto.js';
import * as opaque from '@serenity-kit/opaque';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { StartRegistrationResponseDto } from './dtos/start-registration-response.dto.js';
import { v4 } from 'uuid';
import { FinishRegistrationResponseDto } from './dtos/finish-registration-response.dto.js';
import { FinishRegistrationDto } from './dtos/finish-registration.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthPackage)
    private readonly authPackageRepository: EntityRepository<AuthPackage>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly config: ConfigService,
    private readonly em: EntityManager,
  ) {}

  async startRegistration(
    payload: StartRegistrationDto,
  ): Promise<StartRegistrationResponseDto> {
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

  async finishRegistration(
    payload: FinishRegistrationDto,
  ): Promise<FinishRegistrationResponseDto> {
    // get registration state from cache and validate token
    const cacheKey = `registrationState:${payload.username}`;
    const tokenFromCache = await this.cache.get<{ registrationToken: string }>(
      cacheKey,
    );
    if (!tokenFromCache || tokenFromCache.registrationToken == '')
      throw new NotFoundException(
        `No registration state found for '${payload.username}'`,
      );
    const tokenValid =
      tokenFromCache.registrationToken == payload.registrationToken;
    if (!tokenValid)
      throw new UnauthorizedException(`Provided token is not valid.`);

    // create auth package in db
    const authPackage = this.authPackageRepository.create({
      registrationRecord: payload.registrationRecord,
      id: undefined,
      username: payload.username,
    });
    await this.em.flush();

    return {
      authPackage: authPackage,
      message: `User '${authPackage.username}' registered successfully.`,
      success: true,
    };
  }
}
