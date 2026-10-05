import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        dbName: config.getOrThrow('DB_NAME'),
        host: config.getOrThrow('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        user: config.getOrThrow('DB_USER'),
        password: config.getOrThrow('DB_PASSWORD'),
        entities: ['./dist/**/*.entity.js'],
        entitiesTs: ['./src/**/*.entity.ts'],
        metadataProvider: ReflectMetadataProvider,
      }),
      inject: [ConfigService],
      driver: PostgreSqlDriver,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
