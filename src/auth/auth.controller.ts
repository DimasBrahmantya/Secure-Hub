import { Controller, Post, Body, Get, Delete, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // REGISTER
  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  // LOGIN -> KIRIM OTP
  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }

  // VERIFIKASI OTP
  @Post('verify-otp')
  verifyOtp(@Body() body: any) {
    return this.authService.verifyOtp(body.userId, body.otp);
  }

  // ===========================
  // CRUD untuk UserManagement
  // ===========================

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.authService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.authService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.authService.delete(id);
  }
}
