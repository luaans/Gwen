import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IReminder {
  _id: Types.ObjectId;
  personId?: Types.ObjectId;
  title: string;
  reason?: string;
  status: "open" | "done" | "snoozed";
  priority: number;
  dueAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reminderSchema = new Schema<IReminder>(
  {
    personId: { type: Schema.Types.ObjectId, ref: "Person", index: true },
    title: { type: String, required: true, trim: true },
    reason: { type: String, trim: true },
    status: {
      type: String,
      enum: ["open", "done", "snoozed"],
      default: "open",
      index: true,
    },
    priority: { type: Number, min: 1, max: 10, default: 5 },
    dueAt: { type: Date },
  },
  {
    timestamps: true,
    collection: "reminders",
  },
);

export const Reminder: Model<IReminder> =
  (models.Reminder as Model<IReminder>) ||
  model<IReminder>("Reminder", reminderSchema);
