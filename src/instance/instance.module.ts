import { Module } from '@nestjs/common';
import { InstanceService } from './instance.service.js';
import { InstanceController } from './instance.controller.js';

@Module({
  providers: [InstanceService],
  controllers: [InstanceController]
})
export class InstanceModule {}
