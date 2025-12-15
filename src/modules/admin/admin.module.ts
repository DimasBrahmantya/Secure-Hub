import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from 'src/auth/schemas/auth.schema';
import { Report, ReportSchema } from './schemas/report.schema';
import { SystemStatus, SystemStatusSchema } from './schemas/system.schema';
import { AdminAction, AdminActionSchema } from './schemas/admin-action.schema';
import { BackupSchema } from '../backup/schemas/backup.schema';      // hanya schema
import { PhishingSchema } from '../antiphishing/schemas/phishing.schema'; // hanya schema

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Report.name, schema: ReportSchema },
      { name: SystemStatus.name, schema: SystemStatusSchema },
      { name: AdminAction.name, schema: AdminActionSchema },
      { name: 'Backup', schema: BackupSchema },      // model name "Backup"
      { name: 'Phishing', schema: PhishingSchema },  // model name "Phishing"
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminAction],
})
export class AdminModule {}
