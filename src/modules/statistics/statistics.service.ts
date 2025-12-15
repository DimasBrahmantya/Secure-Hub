import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { User, UserDocument } from 'src/auth/schemas/auth.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel('Backup') private backupModel: Model<Document & any>,
    @InjectModel('Phishing') private phishingModel: Model<Document & any>,
  ) {}

  async getDashboardStats() {
    // ============================
    // USERS STATISTICS
    // ============================
    const totalUsers = await this.userModel.countDocuments();
    // NOTE: user schema uses 'status' field (string "active"/"inactive"), bukan boolean 'active'
    const activeUsers = await this.userModel.countDocuments({ status: 'active' });
    // role in schema default is 'User' (capitalized), jadi gunakan regex case-insensitive
    const adminUsers = await this.userModel.countDocuments({ role: /admin/i });

    // ============================
    // SYSTEM / BACKUP
    // ============================
    // Backup schema has createdAt field (you set createdAt in plain schema),
    // so we fetch latest backup by createdAt (if present)
    const lastBackup = await this.backupModel
      .findOne()
      .sort({ createdAt: -1 })
      .lean() as any;

    let lastBackupTime = '-';
    let nextBackup = '-';

    if (lastBackup && typeof lastBackup === 'object' && !Array.isArray(lastBackup)) {
      const createdAt = lastBackup.createdAt || lastBackup.time; // defensive
      if (createdAt) {
        const d = new Date(createdAt);
        lastBackupTime = isNaN(d.getTime()) ? '-' : d.toISOString();
        nextBackup = new Date(d.getTime() + 24 * 60 * 60 * 1000).toISOString();
      }
    }

    // ============================
    // PHISHING REPORT
    // ============================
    // Phishing schema uses 'blocked' boolean and stores time in 'time'
    const totalReports = await this.phishingModel.countDocuments();
    const threatsBlocked = await this.phishingModel.countDocuments({ blocked: true });

    // ============================
    // SECURITY SCORE (string)
    // ============================
    let securityScore = '0%';
    if (totalReports > 0) {
      const score = Math.round((threatsBlocked / totalReports) * 100);
      securityScore = `${score}%`;
    }

    // ============================
    // RESULT
    // ============================
    return {
      users: {
        totalUsers,
        activeUsers,
        adminUsers,
      },
      system: {
        lastBackup: lastBackupTime,
        nextBackup,
        aiSensitivity: 'Medium', // you can replace with actual value if stored elsewhere
        securityScore,
      },
      reports: {
        totalReports,
        threatsBlocked,
      },
    };
  }
}
