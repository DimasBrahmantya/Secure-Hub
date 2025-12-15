import { Schema } from 'mongoose';

export const MonitoringSchema = new Schema({
  type: { type: String, required: true },     // "activity" | "notification"
  title: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: Date, default: Date.now },
});
