import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';

import { ConfigModule } from '@app/common/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        ({
          uri: configService.get('MONGO_CONNECTION_STRING'),
        }) as MongooseModuleFactoryOptions,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
