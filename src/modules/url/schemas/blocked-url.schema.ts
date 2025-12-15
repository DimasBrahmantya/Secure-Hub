import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BlockedURL extends Document {
  @Prop({ required: true })
  url: string;

  @Prop({ default: 'manual' })
  blockedBy: string;
}

export const BlockedURLSchema = SchemaFactory.createForClass(BlockedURL);
