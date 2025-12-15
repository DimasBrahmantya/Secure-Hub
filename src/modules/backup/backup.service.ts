import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { MonitoringService } from '../monitoring/monitoring.service';
import type { File } from 'multer';

@Injectable()
export class BackupService {
  constructor(
    @InjectModel('Backup') private backupModel: Model<any>,
    private monitoring: MonitoringService,
  ) {}

  async createBackupNow() {
    const backupDir = './backups';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const fileName = `backup-${Date.now()}.zip`;
    const filePath = path.join(backupDir, fileName);

    // SIMULASI BACKUP DATABASE
    fs.writeFileSync(filePath, 'DATABASE_BACKUP_CONTENT');

    const stats = fs.statSync(filePath);

    const doc = await this.backupModel.create({
      fileName,
      size: stats.size,
      status: 'ready',
    });

    await this.monitoring.createLog(
      'activity',
      'Backup Created',
      `Backup ${fileName} berhasil dibuat`,
    );

    // ⬅️ INI KUNCI PENTING
    return {
      _id: doc._id,
      fileName: doc.fileName,
      size: doc.size,
      status: doc.status,
      createdAt: doc.createdAt,
    };
  }

  // ✅ UPLOAD ZIP BACKUP
  async uploadBackup(file: File) {
    const backupDir = './backups';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const targetPath = path.join(backupDir, file.originalname);
    fs.writeFileSync(targetPath, file.buffer);

    const doc = await this.backupModel.create({
      fileName: file.originalname,
      size: file.size,
      status: 'ready',
    });

    await this.monitoring.createLog(
      'activity',
      'Backup Uploaded',
      `Backup ${file.originalname} berhasil diupload`,
    );

    return doc;
  }

  async getBackups() {
    return this.backupModel.find().sort({ createdAt: -1 }).lean();
  }

  async deleteBackup(id: string) {
    const data = await this.backupModel.findById(id);
    if (data) {
      const filePath = path.join('./backups', data.fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await this.monitoring.createLog(
      'activity',
      'Backup Deleted',
      `Backup ${id} dihapus`,
    );

    return this.backupModel.findByIdAndDelete(id);
  }

  // ✅ MARK AS RESTORED
  async restoreBackup(fileName: string) {
    const filePath = path.join('./backups', fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    // UPDATE STATUS
    await this.backupModel.updateOne(
      { fileName },
      { $set: { status: 'restored' } },
    );

    await this.monitoring.createLog(
      'activity',
      'Database Restored',
      `Database direstore dari ${fileName}`,
    );

    return { restored: true, fileName, status: 'restored' };
  }
}
