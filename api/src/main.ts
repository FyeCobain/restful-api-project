// Import core libraries
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  // Setting up the app
  app.useGlobalPipes(new ValidationPipe())
  app.use(helmet())

  // Setting OpenAPI docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('RESTful API project')
    .setDescription('This is an RESTful API project for the SDJS-102 course.')
    .setVersion('1.0')
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs/api', app, swaggerDocument)

  await app.listen(3000)
}
bootstrap()
