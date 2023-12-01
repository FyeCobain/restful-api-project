// Core / common imports
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'

// Libraries imports
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { CsrfInterceptor } from '@tekuconcept/nestjs-csrf'
import { ValidationError } from 'class-validator'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  // Setting up the validation with default 422 status code
  const validationException = new UnprocessableEntityException()
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes incoming properties without a decorator in the DTO
      transform: true, // Transforms the plain incoming properties to them respective required types
      // Callback to return a 422 status on validation errors
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException({
          message: errors
            .map((error: ValidationError) => Object.values(error.constraints))
            .flat(),
          error: validationException.message,
          statusCode: validationException.getStatus(),
        })
      },
    }),
  )

  app.use(helmet())

  app.useGlobalInterceptors(
    new CsrfInterceptor({
      methods: { create: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
    }),
  )

  const swaggerConfig = new DocumentBuilder()
    .setTitle('RESTful API project')
    .setDescription('This is an RESTful API project for the SDJS-102 course.')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, swaggerDocument)

  await app.listen(process.env.LISTENING_PORT || 3000)
}

bootstrap()
