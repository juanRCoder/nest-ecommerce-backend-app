import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'Server started and successfully connected',
      status: 'ok',
      date: new Date().toISOString(),
    };
  }
}
