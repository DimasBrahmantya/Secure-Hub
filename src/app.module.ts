import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AntiPhishingModule } from './modules/antiphishing/antiphishing.module';
import { BackupModule } from './modules/backup/backup.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { AdminModule } from './modules/admin/admin.module';

import { StatisticsModule } from './modules/statistics/statistics.module';
import { URLModule } from './modules/url/url.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/securehub'),
    AuthModule,
    DashboardModule,
    AntiPhishingModule,
    BackupModule,
    MonitoringModule,
    AdminModule,
  
    StatisticsModule,
    URLModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
