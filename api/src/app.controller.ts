import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { AppService } from './app.service'
import { CsrfInterceptor } from '@tekuconcept/nestjs-csrf'

@Controller()
@UseInterceptors(CsrfInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
