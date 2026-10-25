import { Controller, Get } from '@nestjs/common';
import { InstanceService } from './instance.service.js';
import { InstanceDataDto } from './dto/instance-data.dto.js';

@Controller('instance')
export class InstanceController {
  constructor(private readonly service: InstanceService) {}

  @Get()
  getInstanceData(): InstanceDataDto {
    return this.service.getInstanceData();
  }
}
