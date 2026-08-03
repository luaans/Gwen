import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IConversation {
  _id: Types.ObjectId;
  personId?: Types.ObjectId;
  title?: string;
  messages: Array<{
    role: "owner" | "gwen" | "system";
    content: string;
    createdAt: Date;
  }>;
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    personId: { type: Schema.Types.ObjectId, ref: "Person", index: true },
    title: { type: String, trim: true },
    messages: [
      {
        role: { type: String, enum: ["owner", "gwen", "system"], required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  },
  {
    timestamps: true,
    collection: "conversations",
  },
);

export const Conversation: Model<IConversation> =
  (models.Conversation as Model<IConversation>) ||
  model<IConversation>("Conversation", conversationSchema);
