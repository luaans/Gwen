import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IJournal {
  _id: Types.ObjectId;
  title: string;
  body?: string;
  occurredAt: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const journalSchema = new Schema<IJournal>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, trim: true },
    occurredAt: { type: Date, default: Date.now },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
    collection: "journal",
  },
);

export const Journal: Model<IJournal> =
  (models.Journal as Model<IJournal>) || model<IJournal>("Journal", journalSchema);
