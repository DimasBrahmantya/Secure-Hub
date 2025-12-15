import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';
import { MonitoringSchema } from './schemas/monitoring.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Monitoring', schema: MonitoringSchema }]),
  ],
  controllers: [MonitoringController],
  providers: [MonitoringService],
  exports: [MonitoringService], // agar bisa dipakai BackupService, AntiPhishing, dst
})
export class MonitoringModule {}
