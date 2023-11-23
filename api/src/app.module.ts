// Import core libraries
import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { MongooseModule } from '@nestjs/mongoose'

// Import config files
import { ConfigModule, ConfigService } from '@nestjs/config'
import { throttlerConfig, databaseConfig, secretsConfig } from '@config/index'

// Import own app files
import { AppController } from './app.controller'
import { AppService } from './app.service'

// Import csrf protection files
import { createModule } from 'create-nestjs-middleware-module'
import { CsrfModule } from '@tekuconcept/nestjs-csrf'
import * as session from 'express-session'

// Import feature modules
import { UsersModule } from '@features/users/users.module'
import { AuthModule } from '@features/auth/auth.module'

// Validation with joi
import * as Joi from 'joi'

// Mailer
import { MailerModule } from '@nestjs-modules/mailer'
import { join } from 'path'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'

// Sessiion module for the csrf protection
const SessionModuleBase = createModule(() => {
  return session({
    secret: 'idk-if-this-is-ok-here',
    resave: false,
    saveUninitialized: true,
  })
})

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [throttlerConfig, databaseConfig, secretsConfig],
      validationSchema: Joi.object({
        LISTENING_PORT: Joi.number().required().valid(4000),
        THROTTLE_TTL: Joi.number().required(),
        THROTTLE_LIMIT: Joi.number().required().less(15),
        MONGODB_URI: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required().min(16),
        JWT_REFRESH_SECRET: Joi.string().required().min(16),
        JWT_RESET_PASS_SECRET: Joi.string().required().min(16),
        SMTP_HOST: Joi.string().required(),
        SMTP_USER: Joi.string().required(),
        SMTP_PASS: Joi.string().required(),
      }),
    }),
    // csrf protection
    SessionModuleBase.forRoot({}),
    CsrfModule,
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
    // Mongo DB connenction
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.mongoDBConnectionString'),
      }),
    }),
    // Mailer Module
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      template: {
        dir: join(__dirname, 'mails'),
        adapter: new EjsAdapter(),
      },
    }),
    // Features modules
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
