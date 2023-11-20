import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('index')
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
