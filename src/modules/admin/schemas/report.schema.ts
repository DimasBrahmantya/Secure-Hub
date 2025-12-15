import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TimestampsPlugin } from 'src/common/plugins/timestamps.plugin';

export type ReportDocument = HydratedDocument<Report>;

@Schema({ timestamps: true, versionKey: false })
export class Report {
  @Prop({ required: true })
  type: string;

  @Prop({ default: false })
  isBlocked: boolean;
}

export const ReportSchema = SchemaFactory.createForClass(Report);

ReportSchema.plugin(TimestampsPlugin);
