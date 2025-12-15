import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonitoringService } from '../monitoring/monitoring.service';

@Injectable()
export class AntiPhishingService {
  constructor(
    @InjectModel('Phishing') private phishingModel: Model<any>,
    private monitoring: MonitoringService,
  ) {}

  async blockUrl(url: string) {
    const updated = await this.phishingModel.findOneAndUpdate(
      { url },
      { blocked: true },
      { new: true },
    );

    await this.monitoring.createLog(
      'notification',
      'URL Blocked',
      `URL ${url} ditandai sebagai blocked`,
    );

    return updated;
  }

  async reportUrl(url: string) {
    const updated = await this.phishingModel.findOneAndUpdate(
      { url },
      { reported: true },
      { new: true },
    );

    await this.monitoring.createLog(
      'notification',
      'URL Reported',
      `URL ${url} telah dilaporkan oleh user`,
    );

    return updated;
  }

  async scanUrl(url: string) {
    const domain = this.extractDomain(url);

    const safeExt = ['.com', '.co.id', '.my.id', '.id', '.go.id'];
    const dangerExt = ['.xyz', '.xxx', '.lol', '.icu', '.click', '.zip', '.top'];
    const dangerKeywords = [
      'login', 'verify', 'auth', 'secure', 'bank', 'gift',
      'free', 'claim', 'update', 'confirm', 'password',
      'scam', 'phish', 'malware',
    ];

    let status: 'Safe' | 'Danger' | 'Warning' = 'Warning';
    let threat = 'Suspicious Content';

    if (dangerExt.some((ext) => domain.endsWith(ext))) {
      status = 'Danger';
      threat = 'Dangerous Domain Extension';
    } else if (dangerKeywords.some((key) => domain.includes(key))) {
      status = 'Danger';
      threat = 'Phishing Keyword Detected';
    } else if (safeExt.some((ext) => domain.endsWith(ext))) {
      status = 'Safe';
      threat = 'None';
    } else {
      status = 'Warning';
      threat = 'Suspicious or Unknown Domain';
    }

    const result = await this.phishingModel.create({
      url,
      domain,
      status,
      threat,
      time: new Date(),
    });

    await this.monitoring.createLog(
      'activity',
      'Phishing Scan',
      `Scan terhadap ${url} menghasilkan status: ${status}`,
    );

    return result;
  }

  async getAll() {
    return this.phishingModel.find().sort({ time: -1 }).lean();
  }

  async getByUrl(url: string) {
    return this.phishingModel.findOne({ url }).lean();
  }

  private extractDomain(url: string): string {
    try {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      return new URL(normalizedUrl).hostname.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  }
}
