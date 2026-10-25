import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InstanceDataDto } from './dto/instance-data.dto.js';

@Injectable()
export class InstanceService {
  constructor(private readonly configService: ConfigService) {}

  getInstanceData(): InstanceDataDto {
    const instanceData: InstanceDataDto = {
      fullUrl: '',
      id: this.configService.getOrThrow<string>('INSTANCE_ID'),
      tls: this.configService.getOrThrow<boolean>('INSTANCE_TLS'),
      name: this.configService.getOrThrow<string>('INSTANCE_NAME'),
      host: this.configService.getOrThrow<string>('INSTANCE_HOST'),
      port: this.configService.get<number>('INSTANCE_PORT'),
    };
    const prefix = instanceData.tls ? 'https://' : 'http://';
    const suffix = instanceData.port ? `:${instanceData.port}` : '';
    instanceData.fullUrl = `${prefix}${instanceData.host}${suffix}`;
    return instanceData;
  }
}
