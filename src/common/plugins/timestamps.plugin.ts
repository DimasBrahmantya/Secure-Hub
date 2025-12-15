import { Schema } from 'mongoose';

export function TimestampsPlugin(schema: Schema) {
  schema.add({
    createdAt: { type: Date },
    updatedAt: { type: Date },
  });
}
