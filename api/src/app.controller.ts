import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiExcludeController } from '@nestjs/swagger'

@ApiExcludeController(true)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // A simple Hello World
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
