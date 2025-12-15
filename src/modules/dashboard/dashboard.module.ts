import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { MongooseModule } from '@nestjs/mongoose';

import { PhishingSchema } from '../antiphishing/schemas/phishing.schema';
import { BackupSchema } from '../backup/schemas/backup.schema';
import { MonitoringSchema } from '../monitoring/schemas/monitoring.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Phishing', schema: PhishingSchema },
      { name: 'Backup', schema: BackupSchema },
      { name: 'Monitoring', schema: MonitoringSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
