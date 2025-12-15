import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TimestampsPlugin } from 'src/common/plugins/timestamps.plugin';

export type SystemStatusDocument = HydratedDocument<SystemStatus>;

@Schema({ timestamps: true, versionKey: false })
export class SystemStatus {
  @Prop()
  lastBackup: string;

  @Prop()
  nextBackup: string;

  @Prop()
  aiSensitivity: string;

  @Prop()
  securityScore: number;
}

export const SystemStatusSchema = SchemaFactory.createForClass(SystemStatus);

SystemStatusSchema.plugin(TimestampsPlugin);
