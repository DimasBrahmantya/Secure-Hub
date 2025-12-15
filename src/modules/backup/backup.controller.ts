import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BackupService } from './backup.service';
import { FileInterceptor } from '@nestjs/platform-express';
import express from 'express';
import * as path from 'path';
import type { Multer } from 'multer';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get()
  getAll() {
    return this.backupService.getBackups();
  }

  // ✅ UPLOAD ZIP (BACKUP)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadBackup(@UploadedFile() file: Multer.File) {
    return this.backupService.uploadBackup(file);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.backupService.deleteBackup(id);
  }

  @Post('restore/:file')
  async restore(
    @Param('file') file: string,
  ) {
    await this.backupService.restoreBackup(file);
  }

  @Post()
  async createBackup() {
    return this.backupService.createBackupNow();
  }
}
