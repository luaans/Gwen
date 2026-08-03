import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Person, Questionnaire, Summary } from "@/models";
import { getQuestionnaireByPersonId } from "./questionnaire.service";

export type SummaryDTO = {
  id: string;
  personId: string;
  content: string;
  version: number;
  source: string;
  createdAt: string;
};

function buildSummaryFromQuestionnaire(
  personName: string,
  q: Awaited<ReturnType<typeof getQuestionnaireByPersonId>>,
): string {
  if (!q) {
    return `${personName} ainda não compartilhou o primeiro encontro com a Gwen.`;
  }

  const parts: string[] = [];
  const preferred = q.whoYouAre?.preferredName || personName;
  parts.push(`${preferred} já teve o primeiro encontro com a Gwen.`);

  if (q.whoYouAre?.howMetLuan) {
    parts.push(`Conheceu o Luan assim: ${q.whoYouAre.howMetLuan}`);
  }

  if (q.personality?.description?.length) {
    parts.push(
      `Personalidade: ${q.personality.description.slice(0, 6).join(", ")}.`,
    );
  }

  if (q.personality?.definingTraits?.length) {
    parts.push(
      `Características centrais: ${q.personality.definingTraits.slice(0, 6).join(", ")}.`,
    );
  }

  if (q.communication?.conversationLength) {
    parts.push(
      `Prefere conversas ${q.communication.conversationLength} e conselhos ${q.communication.adviceStyle || "conforme o momento"}.`,
    );
  }

  if (q.gwenStyle?.tones?.length) {
    parts.push(`Gosta que a Gwen seja: ${q.gwenStyle.tones.join(", ")}.`);
  }

  if (q.gwenStyle?.howSheIs?.length) {
    parts.push(
      `Como companheira: ${q.gwenStyle.howSheIs.slice(0, 4).join(", ")}.`,
    );
  }

  if (q.forGwen?.neverForget) {
    parts.push(`Nunca esquecer: ${q.forGwen.neverForget}`);
  }

  if (q.forGwen?.alwaysAsk) {
    parts.push(`Sempre lembrar de perguntar: ${q.forGwen.alwaysAsk}`);
  }

  if (q.forGwen?.neverStore) {
    parts.push(`Não armazenar: ${q.forGwen.neverStore}`);
  }

  if (q.friendship?.memorableMoment) {
    parts.push(`Momento marcante com o Luan: ${q.friendship.memorableMoment}`);
  }

  return parts.join(" ");
}

export async function generatePersonSummary(
  personId: string,
  source: "manual" | "questionnaire" | "conversation" | "system" = "system",
): Promise<SummaryDTO> {
  await connectDB();
  const person = await Person.findById(personId);
  if (!person) {
    throw new Error("Pessoa não encontrada");
  }

  const questionnaire = await getQuestionnaireByPersonId(personId);
  const content = buildSummaryFromQuestionnaire(person.fullName, questionnaire);

  const latest = await Summary.findOne({ personId }).sort({ version: -1 });
  const version = (latest?.version || 0) + 1;

  const summary = await Summary.create({
    personId: new Types.ObjectId(personId),
    content,
    version,
    source,
  });

  person.summary = content;
  await person.save();

  return {
    id: summary._id.toString(),
    personId,
    content,
    version,
    source,
    createdAt: summary.createdAt.toISOString(),
  };
}

export async function getLatestSummary(
  personId: string,
): Promise<SummaryDTO | null> {
  await connectDB();
  const summary = await Summary.findOne({ personId }).sort({ version: -1 });
  if (!summary) return null;
  return {
    id: summary._id.toString(),
    personId,
    content: summary.content,
    version: summary.version,
    source: summary.source,
    createdAt: summary.createdAt.toISOString(),
  };
}

/** Gera resumo automaticamente se a pessoa ainda não tiver um. */
export async function ensurePersonSummary(personId: string) {
  await connectDB();
  const person = await Person.findById(personId);
  if (!person) return null;
  if (person.summary?.trim()) return person.summary;
  const hasQ = await Questionnaire.exists({ personId });
  if (!hasQ) return null;
  const summary = await generatePersonSummary(personId, "questionnaire");
  return summary.content;
}
