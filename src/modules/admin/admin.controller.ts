import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('actions')
  getActions() {
    return this.adminService.getAdminActions();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  // === BARU: endpoint untuk menambah recent admin action ===
  @Post('actions')
  addAction(@Body() body: { action: string; admin: string }) {
    return this.adminService.addAdminAction(body.action, body.admin);
  }
}
