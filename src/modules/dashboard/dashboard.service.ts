import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('Phishing') private phishingModel: Model<any>,
    @InjectModel('Backup') private backupModel: Model<any>,
    @InjectModel('Monitoring') private monitoringModel: Model<any>,
  ) {}

  // ==============================
  // TOP STAT CARDS
  // ==============================
  async getStats() {
    const threatsBlocked = await this.phishingModel.countDocuments({
      status: 'Danger',
    });

    const lastBackup = (await this.backupModel
      .findOne()
      .sort({ createdAt: -1 })
      .lean()) as any;

    const lastBackupFormatted = lastBackup
      ? new Date(lastBackup.createdAt).toLocaleString('id-ID', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : 'No backup yet';

    return [
      {
        title: 'Security Status',
        value: 'Protected',
        subtitle: 'All systems operational',
      },
      {
        title: 'Last Backup',
        value: lastBackupFormatted,
        subtitle: 'Based on latest backup record',
      },
      {
        title: 'Threats Blocked',
        value: threatsBlocked.toString(),
        subtitle: 'Detected dangerous URLs',
      },
      {
        title: 'Active Monitoring',
        value: '24/7',
        subtitle: 'Real-time protection',
      },
    ];
  }

  // ==============================
  // DASHBOARD OVERVIEW (FEATURE CARD)
  // ==============================
  async getOverview() {
    // === PHISHING ===
    const urlsAnalyzedToday = await this.phishingModel.countDocuments({
      time: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });

    const threatsDetected = await this.phishingModel.countDocuments({
      blocked: true,
    });

    // === BACKUP ===
    const totalBackups = await this.backupModel.countDocuments();

    const storageAgg = await this.backupModel.aggregate([
      { $group: { _id: null, total: { $sum: '$size' } } },
    ]);

    const storageUsed =
      storageAgg.length > 0
        ? `${(storageAgg[0].total / 1024 / 1024).toFixed(2)} MB`
        : '0 MB';

    // === MONITORING ===
    const activeSessions = await this.monitoringModel.countDocuments({
      type: 'activity',
    });

    const pendingAlerts = await this.monitoringModel.countDocuments({
      type: 'notification',
    });

    return {
      phishing: {
        urlsAnalyzedToday,
        threatsDetected,
      },
      backup: {
        total: totalBackups,
        storageUsed,
      },
      monitoring: {
        activeSessions,
        pendingAlerts,
      },
      admin: {
        totalUsers: 0,
        aiSensitivity: 'High',
      },
    };
  }

  // ==============================
  // RECENT ACTIVITY
  // ==============================
  async getActivity() {
    return this.monitoringModel.find().sort({ time: -1 }).limit(10).lean();
  }
}
