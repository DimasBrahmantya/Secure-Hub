import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/auth.schema';
import { Report } from './schemas/report.schema';
import { SystemStatus } from './schemas/system.schema';
import {
  AdminAction,
  AdminActionDocument,
} from './schemas/admin-action.schema';
import { generateTimeAgo } from './utils/time-ago';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Report.name) private reportModel: Model<Report>,
    @InjectModel(SystemStatus.name) private systemModel: Model<SystemStatus>,
    @InjectModel(AdminAction.name)
    private actionModel: Model<AdminActionDocument>,
    @InjectModel('Backup') private backupModel: Model<any>,
    @InjectModel('Phishing') private phishingModel: Model<any>,
  ) {}

  async getDashboardStats() {
    /** ================= USERS ================= */
    const totalUsers = await this.userModel.countDocuments();
    const activeUsers = await this.userModel.countDocuments({
      status: 'active',
    });
    const adminUsers = await this.userModel.countDocuments({
      role: 'Admin',
    });

    /** ================= REPORTS ================= */
    const reportTotal = await this.reportModel.countDocuments();
    const reportBlocked = await this.reportModel.countDocuments({
      isBlocked: true,
    });

    /** ================= PHISHING ================= */
    const phishingTotal = await this.phishingModel.countDocuments();
    const phishingBlocked = await this.phishingModel.countDocuments({
      blocked: true,
    });

    /** ================= BACKUP ================= */
    const lastBackupDoc = await this.backupModel
      .findOne<{ createdAt: Date }>()
      .sort({ createdAt: -1 })
      .lean();

    const lastBackup = lastBackupDoc
      ? new Date(lastBackupDoc.createdAt).toLocaleString()
      : 'N/A';

    /** ================= SYSTEM ================= */
    let system = await this.systemModel.findOne().lean();

    if (!system) {
      system = await this.systemModel.create({
        lastBackup,
        nextBackup: '24h',
        aiSensitivity: 'medium',
        securityScore: 80,
      });
    }

    /** ================= FINAL RESPONSE ================= */
    return {
      users: {
        totalUsers,
        activeUsers,
        adminUsers,
      },

      reports: {
        totalReports: reportTotal + phishingTotal,
        threatsBlocked: reportBlocked + phishingBlocked,
      },

      system: {
        lastBackup,
        nextBackup: system.nextBackup ?? '24h',
        aiSensitivity: system.aiSensitivity ?? 'medium',
        securityScore: system.securityScore ?? 80,
      },
    };
  }

  async getAdminActions() {
    return this.actionModel.find().sort({ createdAt: -1 }).exec();
  }

  async getUsers() {
    return this.userModel.find().select('-password').lean();
  }

  async addAdminAction(action: string, admin: string) {
    const created = await this.actionModel.create({
      action,
      admin,
      timeAgo: 'baru saja',
    });

    created.timeAgo = generateTimeAgo(created.createdAt!);
    await created.save();

    return created;
  }
}
