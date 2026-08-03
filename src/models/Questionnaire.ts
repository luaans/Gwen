import mongoose, { Schema, model, models, type Model, type Types } from "mongoose";
import type {
  AdviceStyle,
  ConversationPreference,
  GwenTone,
} from "@/types";

export interface IQuestionnaire {
  _id: Types.ObjectId;
  personId: Types.ObjectId;
  whoYouAre: {
    fullName: string;
    preferredName: string;
    age?: number;
    howMetLuan: string;
  };
  personality: {
    description: string[];
    definingTraits: string[];
    whatMakesHappy?: string[];
    whatIrritates?: string[];
  };
  tastes: {
    favoriteGames?: string[];
    favoriteMovies?: string[];
    favoriteSeries?: string[];
    favoriteBooks?: string[];
    favoriteArtists?: string[];
    favoriteFood?: string[];
    hobbies?: string[];
  };
  communication: {
    conversationLength: ConversationPreference;
    adviceStyle: AdviceStyle;
    prefersHonesty: boolean;
    annoyingConversationStyle?: string;
  };
  gwenStyle: {
    tones: GwenTone[];
    howSheIs?: string[];
    howSheWorks?: string[];
    whenPresent?: string[];
    neverDo?: string;
  };
  goals: {
    currentlyConquering?: string;
    dream?: string;
    selfImprove?: string;
  };
  friendship: {
    friendshipWithLuan?: string;
    whatLuanDoesWell?: string;
    whatLuanCouldImprove?: string;
    memorableMoment?: string;
  };
  aboutYou: {
    littleKnownFact?: string;
    catchphrase?: string;
    curiosity?: string;
  };
  forGwen: {
    neverForget?: string;
    alwaysAsk?: string;
    neverStore?: string;
  };
  consent: boolean;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const questionnaireSchema = new Schema<IQuestionnaire>(
  {
    personId: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      index: true,
    },
    whoYouAre: {
      fullName: { type: String, required: true },
      preferredName: { type: String, required: true },
      age: { type: Number },
      howMetLuan: { type: String, required: true },
    },
    personality: {
      description: { type: [String], required: true },
      definingTraits: { type: [String], required: true },
      whatMakesHappy: { type: [String], default: [] },
      whatIrritates: { type: [String], default: [] },
    },
    tastes: {
      favoriteGames: { type: [String], default: [] },
      favoriteMovies: { type: [String], default: [] },
      favoriteSeries: { type: [String], default: [] },
      favoriteBooks: { type: [String], default: [] },
      favoriteArtists: { type: [String], default: [] },
      favoriteFood: { type: [String], default: [] },
      hobbies: { type: [String], default: [] },
    },
    communication: {
      conversationLength: {
        type: String,
        enum: ["curtas", "longas"],
        required: true,
      },
      adviceStyle: {
        type: String,
        enum: ["diretos", "delicadeza", "depende"],
        required: true,
      },
      prefersHonesty: { type: Boolean, required: true },
      annoyingConversationStyle: String,
    },
    gwenStyle: {
      tones: {
        type: [String],
        enum: [
          "divertida",
          "seria",
          "curiosa",
          "objetiva",
          "carinhosa",
          "tanto_faz",
        ],
        required: true,
      },
      howSheIs: { type: [String], default: [] },
      howSheWorks: { type: [String], default: [] },
      whenPresent: { type: [String], default: [] },
      neverDo: String,
    },
    goals: {
      currentlyConquering: String,
      dream: String,
      selfImprove: String,
    },
    friendship: {
      friendshipWithLuan: String,
      whatLuanDoesWell: String,
      whatLuanCouldImprove: String,
      memorableMoment: String,
    },
    aboutYou: {
      littleKnownFact: String,
      catchphrase: String,
      curiosity: String,
    },
    forGwen: {
      neverForget: String,
      alwaysAsk: String,
      neverStore: String,
    },
    consent: { type: Boolean, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "questionnaires",
  },
);

export type QuestionnaireDocument = mongoose.HydratedDocument<IQuestionnaire>;

export const Questionnaire: Model<IQuestionnaire> =
  (models.Questionnaire as Model<IQuestionnaire>) ||
  model<IQuestionnaire>("Questionnaire", questionnaireSchema);
