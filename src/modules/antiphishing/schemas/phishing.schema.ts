import { Schema } from 'mongoose';

export const PhishingSchema = new Schema({
  url: { type: String, required: true },
  status: { type: String, required: true },
  threat: { type: String, default: "Unknown" },
  time: { type: Date, default: Date.now },

  blocked: { type: Boolean, default: false },
  reported: { type: Boolean, default: false },
});
