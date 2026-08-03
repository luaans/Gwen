import { Schema, model, models, type Model, type Types } from "mongoose";

export interface ISummary {
  _id: Types.ObjectId;
  personId: Types.ObjectId;
  content: string;
  version: number;
  source: "manual" | "questionnaire" | "conversation" | "system";
  createdAt: Date;
  updatedAt: Date;
}

const summarySchema = new Schema<ISummary>(
  {
    personId: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      index: true,
    },
    content: { type: String, required: true },
    version: { type: Number, default: 1 },
    source: {
      type: String,
      enum: ["manual", "questionnaire", "conversation", "system"],
      default: "system",
    },
  },
  {
    timestamps: true,
    collection: "summaries",
  },
);

export const Summary: Model<ISummary> =
  (models.Summary as Model<ISummary>) || model<ISummary>("Summary", summarySchema);
