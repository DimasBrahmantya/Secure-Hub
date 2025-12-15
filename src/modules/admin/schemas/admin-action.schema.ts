import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TimestampsPlugin } from 'src/common/plugins/timestamps.plugin';

export type AdminActionDocument = HydratedDocument<AdminAction>;

@Schema({ timestamps: true, versionKey: false })
export class AdminAction {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  admin: string;

  @Prop({ required: true })
  timeAgo: string;

  @Prop({ type: Date })
  createdAt: Date;
}


export const AdminActionSchema = SchemaFactory.createForClass(AdminAction);
AdminActionSchema.plugin(TimestampsPlugin);
