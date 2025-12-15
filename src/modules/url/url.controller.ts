import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { URLService } from './url.service';

@Controller('url')
export class URLController {
  constructor(private readonly urlService: URLService) {}

  @Post('report')
  async reportURL(@Body() body: any) {
    const { userId, url, reason } = body;

    if (!userId || !url || !reason) {
      return { message: 'userId, url & reason wajib diisi' };
    }

    const data = await this.urlService.report(userId, url, reason);
    return {
      message: 'URL berhasil direport',
      data,
    };
  }

  @Get('reports/:userId')
  async getReports(@Param('userId') userId: string) {
    const data = await this.urlService.getReports(userId);
    return { data };
  }

  @Post('block')
  async blockURL(@Body() body: any) {
    const { url } = body;

    if (!url) return { message: 'url wajib diisi' };

    const data = await this.urlService.block(url);
    return {
      message: 'URL berhasil diblok',
      data,
    };
  }

  @Get('blocked')
  async getBlocked() {
    const data = await this.urlService.getBlocked();
    return { data };
  }
}
