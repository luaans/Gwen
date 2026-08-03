import { Schema, model, models, type Model, type Types } from "mongoose";

export interface ISettings {
  _id: Types.ObjectId;
  key: string;
  formInviteToken: string;
  ownerDisplayName: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true, default: "global" },
    formInviteToken: { type: String, required: true, unique: true },
    ownerDisplayName: { type: String, required: true, default: "Luan Silva" },
  },
  {
    timestamps: true,
    collection: "settings",
  },
);

export const Settings: Model<ISettings> =
  (models.Settings as Model<ISettings>) ||
  model<ISettings>("Settings", settingsSchema);
