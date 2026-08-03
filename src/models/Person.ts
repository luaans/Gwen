import mongoose, { Schema, model, models, type Model, type Types } from "mongoose";
import type { RelationType } from "@/types";

export interface IPerson {
  _id: Types.ObjectId;
  fullName: string;
  nickname?: string;
  photoUrl?: string;
  relationType: RelationType;
  notes?: string;
  firstMetAt: Date;
  summary: string;
  normalizedName: string;
  createdAt: Date;
  updatedAt: Date;
}

const personSchema = new Schema<IPerson>(
  {
    fullName: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },
    photoUrl: { type: String, trim: true },
    relationType: {
      type: String,
      enum: ["amigo", "familia", "colega", "namorada", "outro"],
      required: true,
      default: "amigo",
    },
    notes: { type: String, trim: true },
    firstMetAt: { type: Date, default: Date.now },
    summary: { type: String, default: "" },
    normalizedName: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
    collection: "people",
  },
);

export type PersonDocument = mongoose.HydratedDocument<IPerson>;

export const Person: Model<IPerson> =
  (models.Person as Model<IPerson>) || model<IPerson>("Person", personSchema);
