import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private service: MonitoringService) {}

  // CREATE LOG (opsional kalau mau tambah manual)
  @Post()
  async create(
    @Body('type') type: 'activity' | 'notification',
    @Body('title') title: string,
    @Body('message') message: string,
  ) {
    return this.service.createLog(type, title, message);
  }

  // Ambil semua log
  @Get()
  async all() {
    return this.service.getAll();
  }

  // Ambil activity saja
  @Get('activity')
  async activity() {
    return this.service.getByType('activity');
  }

  // Ambil notifications saja
  @Get('notification')
  async notif() {
    return this.service.getByType('notification');
  }
}
