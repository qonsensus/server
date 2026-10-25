import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InstanceDataDto } from './dto/instance-data.dto.js';

@Injectable()
export class InstanceService {
  constructor(private readonly configService: ConfigService) {}

  getInstanceData(): InstanceDataDto {
    return {
      instanceName: this.configService.getOrThrow<string>('INSTANCE_NAME'),
      instanceHost: this.configService.getOrThrow<string>('INSTANCE_HOST'),
      instancePort: this.configService.get<number>('INSTANCE_PORT'),
    };
  }
}
