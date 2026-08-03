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

export type ReminderDTO = {
  id: string;
  personId?: string;
  personName?: string;
  title: string;
  reason?: string;
  status: "open" | "done" | "snoozed";
  priority: number;
  dueAt?: string;
  createdAt: string;
};

export type MemoryDTO = {
  id: string;
  personId?: string;
  title: string;
  content: string;
  tags: string[];
  importance: number;
  occurredAt?: string;
  createdAt: string;
};

export type JournalDTO = {
  id: string;
  title: string;
  body?: string;
  occurredAt: string;
  tags: string[];
  createdAt: string;
};
