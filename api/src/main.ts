// Import core libraries
import { NestFactory } from '@nestjs/core'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { CsrfInterceptor } from '@tekuconcept/nestjs-csrf'
import helmet from 'helmet'
import { ValidationError } from 'class-validator'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  // Setting up the validation with 422 status code
  const validationException = new UnprocessableEntityException()
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes incoming properties without a decorator in the DTO
      transform: true, // Transforms the plain incoming properties to them respective required types
      // Callback to return a 422 status on invalid errors
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

  // Using Helmet
  app.use(helmet())

  // Setting up the csrf protection globally
  app.useGlobalInterceptors(
    // Not sure if this is the correct way, but seems to work...
    new CsrfInterceptor({
      methods: { create: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
    }),
  )

  // Setting OpenAPI docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('RESTful API project')
    .setDescription('This is an RESTful API project for the SDJS-102 course.')
    .setVersion('1.0')
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, swaggerDocument)

  await app.listen(process.env.LISTENING_PORT || 3000)
}
bootstrap()
