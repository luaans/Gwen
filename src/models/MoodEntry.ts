import { Schema, model, models, type Model, type Types } from "mongoose";

export type MoodLabel =
  | "radiante"
  | "bem"
  | "neutro"
  | "cansado"
  | "triste"
  | "ansioso"
  | "irritado";

export interface IMoodEntry {
  _id: Types.ObjectId;
  personId?: Types.ObjectId;
  source: "owner" | "conversation" | "system";
  mood: MoodLabel;
  note?: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

const moodEntrySchema = new Schema<IMoodEntry>(
  {
    personId: { type: Schema.Types.ObjectId, ref: "Person", index: true },
    source: {
      type: String,
      enum: ["owner", "conversation", "system"],
      default: "owner",
    },
    mood: {
      type: String,
      enum: [
        "radiante",
        "bem",
        "neutro",
        "cansado",
        "triste",
        "ansioso",
        "irritado",
      ],
      required: true,
    },
    note: { type: String, trim: true },
    score: { type: Number, min: 1, max: 10, default: 5 },
  },
  {
    timestamps: true,
    collection: "mood_entries",
  },
);

export const MoodEntry: Model<IMoodEntry> =
  (models.MoodEntry as Model<IMoodEntry>) ||
  model<IMoodEntry>("MoodEntry", moodEntrySchema);
