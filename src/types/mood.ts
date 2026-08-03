export type MoodLabel =
  | "radiante"
  | "bem"
  | "neutro"
  | "cansado"
  | "triste"
  | "ansioso"
  | "irritado";

export type MoodDTO = {
  id: string;
  personId?: string;
  source: string;
  mood: MoodLabel;
  note?: string;
  score: number;
  createdAt: string;
};

export const MOOD_OPTIONS: Array<{
  value: MoodLabel;
  label: string;
  score: number;
}> = [
  { value: "radiante", label: "Radiante", score: 10 },
  { value: "bem", label: "Bem", score: 8 },
  { value: "neutro", label: "Neutro", score: 5 },
  { value: "cansado", label: "Cansado", score: 4 },
  { value: "ansioso", label: "Ansioso", score: 3 },
  { value: "triste", label: "Triste", score: 2 },
  { value: "irritado", label: "Irritado", score: 2 },
];
