import { Schema } from 'mongoose';

export const BackupSchema = new Schema({
  fileName: { type: String, required: true },
  size: { type: Number, required: true },
  status: {
    type: String,
    enum: ['ready', 'restored'],
    default: 'ready',
  },
  createdAt: { type: Date, default: Date.now },
});
