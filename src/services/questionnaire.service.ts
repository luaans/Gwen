import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { ensureSeed } from "@/lib/seed";
import { Person, Questionnaire } from "@/models";
import type { QuestionnaireInput } from "@/lib/validations";
import { findOrCreatePersonByName } from "./person.service";
import { validateInviteToken } from "./settings.service";

function emptyToUndefined(value?: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export async function submitQuestionnaire(
  token: string,
  input: QuestionnaireInput,
) {
  await connectDB();
  await ensureSeed();

  const valid = await validateInviteToken(token);
  if (!valid) {
    throw new Error("Este convite não é mais válido.");
  }

  if (input.consent !== "sim") {
    throw new Error(
      "Sem o seu consentimento, a Gwen não guarda essas histórias. Tudo bem — obrigado por considerar.",
    );
  }

  const { person } = await findOrCreatePersonByName(
    input.whoYouAre.fullName,
    input.whoYouAre.preferredName,
  );

  const age =
    input.whoYouAre.age === "" || input.whoYouAre.age === undefined
      ? undefined
      : Number(input.whoYouAre.age);

  const questionnaire = await Questionnaire.create({
    personId: new Types.ObjectId(person.id),
    whoYouAre: {
      fullName: input.whoYouAre.fullName.trim(),
      preferredName: input.whoYouAre.preferredName.trim(),
      age: Number.isFinite(age) ? age : undefined,
      howMetLuan: input.whoYouAre.howMetLuan.trim(),
    },
    personality: {
      description: input.personality.description,
      definingTraits: input.personality.definingTraits,
      whatMakesHappy: input.personality.whatMakesHappy || [],
      whatIrritates: input.personality.whatIrritates || [],
    },
    tastes: {
      favoriteGames: input.tastes.favoriteGames || [],
      favoriteMovies: input.tastes.favoriteMovies || [],
      favoriteSeries: input.tastes.favoriteSeries || [],
      favoriteBooks: input.tastes.favoriteBooks || [],
      favoriteArtists: input.tastes.favoriteArtists || [],
      favoriteFood: input.tastes.favoriteFood || [],
      hobbies: input.tastes.hobbies || [],
    },
    communication: {
      conversationLength: input.communication.conversationLength,
      adviceStyle: input.communication.adviceStyle,
      prefersHonesty: input.communication.prefersHonesty === "sim",
      annoyingConversationStyle: emptyToUndefined(
        input.communication.annoyingConversationStyle,
      ),
    },
    gwenStyle: {
      tones: input.gwenStyle.tones,
      howSheIs: input.gwenStyle.howSheIs || [],
      howSheWorks: input.gwenStyle.howSheWorks || [],
      whenPresent: input.gwenStyle.whenPresent || [],
      neverDo: emptyToUndefined(input.gwenStyle.neverDo),
    },
    goals: {
      currentlyConquering: emptyToUndefined(input.goals.currentlyConquering),
      dream: emptyToUndefined(input.goals.dream),
      selfImprove: emptyToUndefined(input.goals.selfImprove),
    },
    friendship: {
      friendshipWithLuan: emptyToUndefined(
        input.friendship.friendshipWithLuan,
      ),
      whatLuanDoesWell: emptyToUndefined(input.friendship.whatLuanDoesWell),
      whatLuanCouldImprove: emptyToUndefined(
        input.friendship.whatLuanCouldImprove,
      ),
      memorableMoment: emptyToUndefined(input.friendship.memorableMoment),
    },
    aboutYou: {
      littleKnownFact: emptyToUndefined(input.aboutYou.littleKnownFact),
      catchphrase: emptyToUndefined(input.aboutYou.catchphrase),
      curiosity: emptyToUndefined(input.aboutYou.curiosity),
    },
    forGwen: {
      neverForget: emptyToUndefined(input.forGwen.neverForget),
      alwaysAsk: emptyToUndefined(input.forGwen.alwaysAsk),
      neverStore: emptyToUndefined(input.forGwen.neverStore),
    },
    consent: true,
    submittedAt: new Date(),
  });

  await Person.findByIdAndUpdate(person.id, { updatedAt: new Date() });

  return {
    questionnaireId: questionnaire._id.toString(),
    personId: person.id,
    personName: person.fullName,
  };
}

export async function getQuestionnaireByPersonId(personId: string) {
  await connectDB();
  return Questionnaire.findOne({ personId }).sort({ submittedAt: -1 }).lean();
}

export async function getRecentQuestionnaires(limit = 5) {
  await connectDB();
  await ensureSeed();

  const items = await Questionnaire.find()
    .sort({ submittedAt: -1 })
    .limit(limit)
    .populate<{ personId: { _id: Types.ObjectId; fullName: string } | null }>(
      "personId",
      "fullName",
    )
    .lean();

  return items.map((item) => {
    const person = item.personId;

    return {
      id: item._id.toString(),
      personId:
        person && typeof person === "object" && "_id" in person
          ? person._id.toString()
          : String(item.personId),
      personName:
        person && typeof person === "object" && "fullName" in person
          ? person.fullName
          : "Alguém especial",
      submittedAt: new Date(item.submittedAt).toISOString(),
    };
  });
}
