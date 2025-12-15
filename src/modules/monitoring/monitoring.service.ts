import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MonitoringService {
  constructor(
    @InjectModel('Monitoring') private monitoringModel: Model<any>,
  ) {}

  // Tambah log baru
  async createLog(type: 'activity' | 'notification', title: string, message: string) {
    return this.monitoringModel.create({
      type,
      title,
      message,
      time: new Date(),
    });
  }

  // Ambil semua log (sort terbaru)
  async getAll() {
    return this.monitoringModel.find().sort({ time: -1 }).lean();
  }

  // Ambil berdasarkan type
  async getByType(type: string) {
    return this.monitoringModel.find({ type }).sort({ time: -1 }).lean();
  }
}
