import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Person, Reminder } from "@/models";
import type { ReminderDTO } from "@/types/dto";
import { getQuestionnaireByPersonId } from "./questionnaire.service";
import { listMemoriesByPerson } from "./memory.service";

export type { ReminderDTO };

function toDTO(
  doc: {
    _id: { toString(): string };
    personId?: { toString(): string } | null;
    title: string;
    reason?: string | null;
    status: "open" | "done" | "snoozed";
    priority: number;
    dueAt?: Date | null;
    createdAt: Date;
  },
  personName?: string,
): ReminderDTO {
  return {
    id: doc._id.toString(),
    personId: doc.personId?.toString(),
    personName,
    title: doc.title,
    reason: doc.reason || undefined,
    status: doc.status,
    priority: doc.priority,
    dueAt: doc.dueAt ? new Date(doc.dueAt).toISOString() : undefined,
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

export async function listOpenReminders(limit = 20): Promise<ReminderDTO[]> {
  await connectDB();
  const items = await Reminder.find({ status: "open" })
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit)
    .populate("personId", "fullName nickname")
    .lean();

  return items.map((item) => {
    const person = item.personId as unknown as {
      _id?: { toString(): string };
      fullName?: string;
      nickname?: string;
    } | null;
    return toDTO(
      {
        ...item,
        personId: person?._id || (item.personId as never),
      } as never,
      person?.nickname || person?.fullName,
    );
  });
}

export async function countOpenReminders(): Promise<number> {
  await connectDB();
  return Reminder.countDocuments({ status: "open" });
}

export async function createReminder(input: {
  title: string;
  reason?: string;
  personId?: string;
  priority?: number;
}): Promise<ReminderDTO> {
  await connectDB();
  const reminder = await Reminder.create({
    title: input.title.trim(),
    reason: input.reason?.trim() || undefined,
    personId: input.personId
      ? new Types.ObjectId(input.personId)
      : undefined,
    priority: input.priority || 5,
    status: "open",
  });
  return toDTO(reminder);
}

export async function completeReminder(id: string): Promise<boolean> {
  await connectDB();
  const result = await Reminder.findByIdAndUpdate(id, { status: "done" });
  return Boolean(result);
}

/** Gera lembretes vivos a partir de lacunas do formulário / pedidos à Gwen. */
export async function syncRemindersForPerson(personId: string) {
  await connectDB();
  const person = await Person.findById(personId);
  if (!person) return [];

  const questionnaire = await getQuestionnaireByPersonId(personId);
  const memories = await listMemoriesByPerson(personId);
  const suggestions: Array<{ title: string; reason: string; priority: number }> =
    [];

  if (!questionnaire) {
    suggestions.push({
      title: `Convidar ${person.nickname || person.fullName} ao primeiro encontro`,
      reason: "Ainda não há formulário respondido.",
      priority: 8,
    });
  } else {
    if (questionnaire.forGwen?.alwaysAsk) {
      suggestions.push({
        title: `Perguntar a ${person.nickname || person.fullName}: ${questionnaire.forGwen.alwaysAsk}`,
        reason: "Pedido no primeiro encontro.",
        priority: 9,
      });
    }

    const tastesEmpty =
      !questionnaire.tastes?.favoriteMovies?.length &&
      !questionnaire.tastes?.favoriteGames?.length &&
      !questionnaire.tastes?.favoriteSeries?.length;
    if (tastesEmpty) {
      suggestions.push({
        title: `Descobrir gostos de ${person.nickname || person.fullName}`,
        reason: "Filmes/jogos/séries ficaram em branco no formulário.",
        priority: 6,
      });
    }

    if (!questionnaire.personality?.whatMakesHappy?.length) {
      suggestions.push({
        title: `Perguntar o que deixa ${person.nickname || person.fullName} feliz`,
        reason: "Campo em branco — a Gwen pode perguntar com carinho.",
        priority: 7,
      });
    }
  }

  if (memories.length === 0) {
    suggestions.push({
      title: `Guardar uma memória sobre ${person.nickname || person.fullName}`,
      reason: "Ainda não há memórias registradas.",
      priority: 5,
    });
  }

  const created: ReminderDTO[] = [];
  for (const suggestion of suggestions) {
    const exists = await Reminder.findOne({
      personId,
      title: suggestion.title,
      status: "open",
    });
    if (exists) continue;
    created.push(
      await createReminder({
        personId,
        title: suggestion.title,
        reason: suggestion.reason,
        priority: suggestion.priority,
      }),
    );
  }

  return created;
}

export async function getRemindersForPerson(personId: string) {
  await connectDB();
  const items = await Reminder.find({ personId, status: "open" })
    .sort({ priority: -1, createdAt: -1 })
    .lean();
  return items.map((item) => toDTO(item as never));
}
