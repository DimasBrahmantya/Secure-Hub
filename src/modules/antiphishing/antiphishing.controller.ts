import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AntiPhishingService } from './antiphishing.service';

@Controller('phishing')
export class AntiPhishingController {
  constructor(private service: AntiPhishingService) {}

  @Post('scan')
  async scan(@Body('url') url: string) {
    return this.service.scanUrl(url);
  }

  @Get()
  async list() {
    return this.service.getAll();
  }

  @Get('check')
  async checkByUrl(@Query('url') url: string) {
    return this.service.getByUrl(url); 
  }

  @Post("block")
async block(@Body() body) {
  return this.service.blockUrl(body.url);
}

@Post("report")
async report(@Body() body) {
  return this.service.reportUrl(body.url);
}

}
