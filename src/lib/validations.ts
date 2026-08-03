import { z } from "zod";

export const relationTypeSchema = z.enum([
  "amigo",
  "familia",
  "colega",
  "namorada",
  "outro",
]);

export const createPersonSchema = z.object({
  fullName: z.string().min(2, "Informe o nome completo"),
  nickname: z.string().optional(),
  relationType: relationTypeSchema,
  notes: z.string().optional(),
});

export const updatePersonSchema = createPersonSchema.partial().extend({
  id: z.string().min(1),
});

const stringList = z.array(z.string());

export const questionnaireSchema = z.object({
  whoYouAre: z.object({
    fullName: z.string().min(2, "Informe seu nome completo"),
    preferredName: z.string().min(1, "Como prefere ser chamado?"),
    age: z
      .union([z.coerce.number().int().min(1).max(120), z.literal("")])
      .optional(),
    howMetLuan: z.string().min(2, "Conte como conheceu o Luan"),
  }),
  personality: z.object({
    description: stringList.min(
      1,
      "Escolha ao menos uma forma de se descrever",
    ),
    definingTraits: stringList.min(
      1,
      "Escolha ao menos uma característica",
    ),
    whatMakesHappy: stringList,
    whatIrritates: stringList,
  }),
  tastes: z.object({
    favoriteGames: stringList,
    favoriteMovies: stringList,
    favoriteSeries: stringList,
    favoriteBooks: stringList,
    favoriteArtists: stringList,
    favoriteFood: stringList,
    hobbies: stringList,
  }),
  communication: z.object({
    conversationLength: z.enum(["curtas", "longas"]),
    adviceStyle: z.enum(["diretos", "delicadeza", "depende"]),
    prefersHonesty: z.enum(["sim", "nao"]),
    annoyingConversationStyle: z.string().optional(),
  }),
  gwenStyle: z.object({
    tones: z
      .array(
        z.enum([
          "divertida",
          "seria",
          "curiosa",
          "objetiva",
          "carinhosa",
          "tanto_faz",
        ]),
      )
      .min(1, "Escolha pelo menos uma opção"),
    howSheIs: stringList.min(
      1,
      "Escolha como gostaria que a Gwen fosse",
    ),
    howSheWorks: stringList.min(
      1,
      "Escolha como a Gwen deveria funcionar",
    ),
    whenPresent: stringList,
    neverDo: z.string().optional(),
  }),
  goals: z.object({
    currentlyConquering: z.string().optional(),
    dream: z.string().optional(),
    selfImprove: z.string().optional(),
  }),
  friendship: z.object({
    friendshipWithLuan: z.string().optional(),
    whatLuanDoesWell: z.string().optional(),
    whatLuanCouldImprove: z.string().optional(),
    memorableMoment: z.string().optional(),
  }),
  aboutYou: z.object({
    littleKnownFact: z.string().optional(),
    catchphrase: z.string().optional(),
    curiosity: z.string().optional(),
  }),
  forGwen: z.object({
    neverForget: z.string().optional(),
    alwaysAsk: z.string().optional(),
    neverStore: z.string().optional(),
  }),
  consent: z.enum(["sim", "nao"]),
});

export type CreatePersonInput = z.infer<typeof createPersonSchema>;
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;
export type QuestionnaireInput = z.infer<typeof questionnaireSchema>;
