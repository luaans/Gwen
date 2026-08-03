import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Conversation, Memory, Person } from "@/models";
import { getQuestionnaireByPersonId } from "./questionnaire.service";
import { ensurePersonSummary } from "./summary.service";

export type ChatMessageDTO = {
  role: "owner" | "gwen" | "system";
  content: string;
  createdAt: string;
};

export type ConversationDTO = {
  id: string;
  personId?: string;
  title?: string;
  messages: ChatMessageDTO[];
  startedAt: string;
  updatedAt: string;
};

function mapConversation(doc: {
  _id: { toString(): string };
  personId?: { toString(): string } | null;
  title?: string | null;
  messages?: Array<{
    role: "owner" | "gwen" | "system";
    content: string;
    createdAt?: Date;
  }>;
  startedAt: Date;
  updatedAt: Date;
}): ConversationDTO {
  return {
    id: doc._id.toString(),
    personId: doc.personId?.toString(),
    title: doc.title || undefined,
    messages: (doc.messages || []).map((message) => ({
      role: message.role,
      content: message.content,
      createdAt: new Date(message.createdAt || Date.now()).toISOString(),
    })),
    startedAt: new Date(doc.startedAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}

export async function getOrCreateConversation(
  personId: string,
): Promise<ConversationDTO> {
  await connectDB();
  let conversation = await Conversation.findOne({ personId }).sort({
    updatedAt: -1,
  });

  if (!conversation) {
    const person = await Person.findById(personId);
    conversation = await Conversation.create({
      personId: new Types.ObjectId(personId),
      title: person
        ? `Conversa sobre ${person.nickname || person.fullName}`
        : "Conversa com a Gwen",
      messages: [
        {
          role: "gwen",
          content:
            "Oi, Luan. Estou aqui. Pode me perguntar sobre essa pessoa, ou só conversar. Eu vou lembrar do que já sei.",
          createdAt: new Date(),
        },
      ],
      startedAt: new Date(),
    });
  }

  return mapConversation(conversation);
}

export async function listRecentConversations(limit = 10) {
  await connectDB();
  const items = await Conversation.find()
    .sort({ updatedAt: -1 })
    .limit(limit)
    .populate("personId", "fullName nickname")
    .lean();

  return items.map((item) => {
    const person = item.personId as unknown as {
      _id?: { toString(): string };
      fullName?: string;
      nickname?: string;
    } | null;

    return {
      id: item._id.toString(),
      personId: person?._id?.toString() || String(item.personId || ""),
      personName: person?.nickname || person?.fullName || "Alguém especial",
      preview:
        item.messages?.[item.messages.length - 1]?.content?.slice(0, 120) || "",
      updatedAt: new Date(item.updatedAt).toISOString(),
    };
  });
}

export async function buildPersonContext(personId: string): Promise<string> {
  await connectDB();
  const person = await Person.findById(personId);
  if (!person) return "";

  await ensurePersonSummary(personId);
  const refreshed = await Person.findById(personId);
  const questionnaire = await getQuestionnaireByPersonId(personId);
  const memories = await Memory.find({ personId })
    .sort({ importance: -1, createdAt: -1 })
    .limit(8)
    .lean();

  const lines = [
    `Nome: ${person.fullName}`,
    person.nickname ? `Apelido: ${person.nickname}` : "",
    `Relação: ${person.relationType}`,
    person.notes ? `Notas do Luan: ${person.notes}` : "",
    refreshed?.summary ? `Resumo: ${refreshed.summary}` : "",
  ].filter(Boolean);

  if (questionnaire) {
    lines.push("--- Primeiro encontro ---");
    if (questionnaire.whoYouAre?.howMetLuan) {
      lines.push(`Como conheceu o Luan: ${questionnaire.whoYouAre.howMetLuan}`);
    }
    if (questionnaire.personality?.description?.length) {
      lines.push(
        `Personalidade: ${questionnaire.personality.description.join(", ")}`,
      );
    }
    if (questionnaire.forGwen?.neverForget) {
      lines.push(`Nunca esquecer: ${questionnaire.forGwen.neverForget}`);
    }
    if (questionnaire.forGwen?.alwaysAsk) {
      lines.push(`Sempre perguntar: ${questionnaire.forGwen.alwaysAsk}`);
    }
    if (questionnaire.forGwen?.neverStore) {
      lines.push(`Nunca armazenar: ${questionnaire.forGwen.neverStore}`);
    }
    if (questionnaire.gwenStyle?.tones?.length) {
      lines.push(`Tom desejado: ${questionnaire.gwenStyle.tones.join(", ")}`);
    }
    if (questionnaire.friendship?.memorableMoment) {
      lines.push(
        `Momento marcante: ${questionnaire.friendship.memorableMoment}`,
      );
    }
  }

  if (memories.length) {
    lines.push("--- Memórias ---");
    for (const memory of memories) {
      lines.push(`• ${memory.title}: ${memory.content}`);
    }
  }

  return lines.join("\n");
}

async function replyWithOpenAI(
  context: string,
  history: ChatMessageDTO[],
  userMessage: string,
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const messages = [
      {
        role: "system",
        content: `Você é a Gwen, uma amiga digital acolhedora do Luan Silva. Fale em português do Brasil, com carinho, elegância e simplicidade. Não soe robótica. Use o contexto abaixo sobre a pessoa. Se não souber algo, diga com honestidade e delicadeza. Nunca invente fatos graves.

Contexto da pessoa:
${context}`,
      },
      ...history.slice(-12).map((message) => ({
        role: message.role === "gwen" ? "assistant" : "user",
        content:
          message.role === "owner"
            ? `Luan: ${message.content}`
            : message.content,
      })),
      { role: "user", content: `Luan: ${userMessage}` },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.7,
        messages,
      }),
    });

    if (!response.ok) {
      console.error("[gwen/openai]", await response.text());
      return null;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error("[gwen/openai]", error);
    return null;
  }
}

function replyFromContext(
  context: string,
  userMessage: string,
  personName: string,
): string {
  const lower = userMessage.toLowerCase();
  const lines = context.split("\n").filter(Boolean);

  if (/lembr|memór|memoria/.test(lower)) {
    const memories = lines.filter((line) => line.startsWith("• "));
    if (memories.length) {
      return `Eu lembro de algumas coisas sobre ${personName}:\n${memories.slice(0, 4).join("\n")}`;
    }
    return `Ainda tenho poucas memórias guardadas sobre ${personName}. Quando você quiser, pode me contar algo importante para eu lembrar.`;
  }

  if (/como.*conheceu|conheceu.*luan|primeiro encontro/.test(lower)) {
    const meet = lines.find((line) => line.startsWith("Como conheceu o Luan:"));
    if (meet) return meet.replace("Como conheceu o Luan:", "Pelo que sei,");
  }

  if (/nunca esquecer|importante/.test(lower)) {
    const never = lines.find((line) => line.startsWith("Nunca esquecer:"));
    if (never) return `Isso eu guardo com cuidado: ${never.replace("Nunca esquecer: ", "")}`;
  }

  if (/personalidade|como.*é|perfil/.test(lower)) {
    const personality = lines.find((line) => line.startsWith("Personalidade:"));
    const summary = lines.find((line) => line.startsWith("Resumo:"));
    if (personality || summary) {
      return [summary?.replace("Resumo: ", ""), personality]
        .filter(Boolean)
        .join(" ");
    }
  }

  const summary = lines.find((line) => line.startsWith("Resumo:"));
  if (summary) {
    return `Sobre ${personName}, o que eu mais carrego agora é isto: ${summary.replace("Resumo: ", "")} Se quiser, posso falar de um detalhe específico.`;
  }

  return `Estou aqui com você. Ainda estou aprendendo sobre ${personName}, mas posso guardar o que você me contar e lembrar disso nas próximas conversas.`;
}

export async function sendConversationMessage(
  personId: string,
  content: string,
): Promise<ConversationDTO> {
  await connectDB();
  const conversation = await Conversation.findOne({ personId }).sort({
    updatedAt: -1,
  });
  if (!conversation) {
    throw new Error("Conversa não encontrada");
  }

  const person = await Person.findById(personId);
  const personName = person?.nickname || person?.fullName || "essa pessoa";
  const context = await buildPersonContext(personId);

  conversation.messages.push({
    role: "owner",
    content: content.trim(),
    createdAt: new Date(),
  });

  const history = conversation.messages.map((message) => ({
    role: message.role,
    content: message.content,
    createdAt: new Date(message.createdAt).toISOString(),
  }));

  const ai =
    (await replyWithOpenAI(context, history.slice(0, -1), content.trim())) ||
    replyFromContext(context, content.trim(), personName);

  conversation.messages.push({
    role: "gwen",
    content: ai,
    createdAt: new Date(),
  });

  try {
    const { detectMoodFromText, createMoodEntry } = await import(
      "./mood.service"
    );
    const detected = detectMoodFromText(content.trim());
    if (detected) {
      await createMoodEntry({
        mood: detected.mood,
        score: detected.score,
        personId,
        source: "conversation",
        note: `Detectado na conversa: "${content.trim().slice(0, 120)}"`,
      });
    }
  } catch (error) {
    console.error("[gwen/mood-from-chat]", error);
  }

  await conversation.save();
  return mapConversation(conversation);
}
