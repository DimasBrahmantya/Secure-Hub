import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

import { User, UserSchema } from 'src/auth/schemas/auth.schema';
import { BackupSchema } from '../backup/schemas/backup.schema';         // hanya schema
import { PhishingSchema } from '../antiphishing/schemas/phishing.schema'; // hanya schema

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: 'Backup', schema: BackupSchema },      // model name "Backup"
      { name: 'Phishing', schema: PhishingSchema },  // model name "Phishing"
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
