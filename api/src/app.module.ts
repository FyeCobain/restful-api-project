// Import core libraries
import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'

// Import config files
import { ConfigModule, ConfigService } from '@nestjs/config'
import { throttlerConfig } from '@config/index'

// Import own app files
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [throttlerConfig],
    }),
    // Rate limit protection
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('throttler.ttl'),
          limit: configService.get<number>('throttler.limit'),
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
