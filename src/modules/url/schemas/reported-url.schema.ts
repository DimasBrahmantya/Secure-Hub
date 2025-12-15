import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ReportedURL extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  reason: string;
}

export const ReportedURLSchema = SchemaFactory.createForClass(ReportedURL);
