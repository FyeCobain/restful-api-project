import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiExcludeController, ApiOkResponse } from '@nestjs/swagger'

@ApiExcludeController(true)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // A simple Hello World
  @Get()
  @ApiOkResponse({ description: 'OK' })
  getHello(): string {
    return this.appService.getHello()
  }
}
