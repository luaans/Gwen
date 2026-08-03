import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IMemory {
  _id: Types.ObjectId;
  personId?: Types.ObjectId;
  title: string;
  content: string;
  tags?: string[];
  importance?: number;
  occurredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const memorySchema = new Schema<IMemory>(
  {
    personId: { type: Schema.Types.ObjectId, ref: "Person", index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    importance: { type: Number, min: 1, max: 10, default: 5 },
    occurredAt: { type: Date },
  },
  {
    timestamps: true,
    collection: "memories",
  },
);

export const Memory: Model<IMemory> =
  (models.Memory as Model<IMemory>) || model<IMemory>("Memory", memorySchema);
