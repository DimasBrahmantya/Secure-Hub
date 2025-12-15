import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhishingSchema } from './schemas/phishing.schema';
import { AntiPhishingController } from './antiphishing.controller';
import { AntiPhishingService } from './antiphishing.service';
import { MonitoringModule } from '../monitoring/monitoring.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Phishing', schema: PhishingSchema }]),
    MonitoringModule, // ← WAJIB ADA
  ],
  controllers: [AntiPhishingController],
  providers: [AntiPhishingService],
})
export class AntiPhishingModule {}
