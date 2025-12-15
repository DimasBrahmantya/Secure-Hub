import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('admin')
export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}

  @Get('stats')
  async getStats() {
    return this.service.getDashboardStats();
  }
}
