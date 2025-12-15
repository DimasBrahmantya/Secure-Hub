import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReportedURL } from './schemas/reported-url.schema';
import { BlockedURL } from './schemas/blocked-url.schema';

@Injectable()
export class URLService {
  constructor(
    @InjectModel(ReportedURL.name)
    private reportedModel: Model<ReportedURL>,
    @InjectModel(BlockedURL.name)
    private blockedModel: Model<BlockedURL>,
  ) {}

  async report(userId: string, url: string, reason: string) {
    return this.reportedModel.create({ userId, url, reason });
  }

  async getReports(userId: string) {
    return this.reportedModel.find({ userId }).sort({ createdAt: -1 });
  }

  async block(url: string, blockedBy: string = 'admin') {
    return this.blockedModel.create({ url, blockedBy });
  }

  async getBlocked() {
    return this.blockedModel.find().sort({ createdAt: -1 });
  }
}
