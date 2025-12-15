import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop({ default: 'User' })
  role: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  otp: string;

  @Prop({ type: Date })
  otpExpiration: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
