import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthPackage } from './entities/auth-package.entity.js';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [MikroOrmModule.forFeature([AuthPackage]), CacheModule.register()],
})
export class AuthModule {}
