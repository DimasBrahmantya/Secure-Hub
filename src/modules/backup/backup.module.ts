import { Module } from '@nestjs/common';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BackupSchema } from './schemas/backup.schema';
import { MonitoringModule } from '../monitoring/monitoring.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Backup', schema: BackupSchema }]),
    MonitoringModule, // ← WAJIB ADA JUGA
  ],
  controllers: [BackupController],
  providers: [BackupService],
})
export class BackupModule {}
