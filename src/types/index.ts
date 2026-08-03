export type RelationType =
  | "amigo"
  | "familia"
  | "colega"
  | "namorada"
  | "outro";

export const RELATION_LABELS: Record<RelationType, string> = {
  amigo: "Amigo",
  familia: "Família",
  colega: "Colega",
  namorada: "Namorada",
  outro: "Outro",
};

export type ConversationPreference = "curtas" | "longas";

export type AdviceStyle = "diretos" | "delicadeza" | "depende";

export type GwenTone =
  | "divertida"
  | "seria"
  | "curiosa"
  | "objetiva"
  | "carinhosa"
  | "tanto_faz";

export interface PersonDTO {
  id: string;
  fullName: string;
  nickname?: string;
  photoUrl?: string;
  relationType: RelationType;
  notes?: string;
  firstMetAt: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  hasQuestionnaire?: boolean;
}

export interface QuestionnaireSections {
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
}

export interface QuestionnaireDTO {
  id: string;
  personId: string;
  sections: QuestionnaireSections;
  submittedAt: string;
  createdAt: string;
}

export interface DashboardData {
  peopleCount: number;
  recentQuestionnaires: Array<{
    id: string;
    personName: string;
    personId: string;
    submittedAt: string;
  }>;
  recentPeople: PersonDTO[];
  people: PersonDTO[];
  inviteToken: string;
}

export interface ActionResult<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}
