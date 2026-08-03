import {
  BOOK_GENRES,
  DEFINING_TRAITS,
  FOOD_STYLES,
  GAME_GENRES,
  GWEN_HOW_SHE_IS,
  GWEN_HOW_SHE_WORKS,
  GWEN_WHEN_PRESENT,
  HAPPY_MOMENTS,
  HOBBY_OPTIONS,
  IRRITATIONS,
  MOVIE_GENRES,
  MUSIC_GENRES,
  PERSONALITY_TRAITS,
  SERIES_GENRES,
  type SelectOption,
} from "@/lib/form-options";
import { formatDate } from "@/utils/normalize";

type QuestionnaireView = {
  submittedAt: Date | string;
  whoYouAre?: {
    fullName?: string;
    preferredName?: string;
    age?: number | null;
    howMetLuan?: string;
  } | null;
  personality?: {
    description?: string[] | null;
    definingTraits?: string[] | null;
    whatMakesHappy?: string[] | null;
    whatIrritates?: string[] | null;
  } | null;
  tastes?: {
    favoriteGames?: string[] | null;
    favoriteMovies?: string[] | null;
    favoriteSeries?: string[] | null;
    favoriteBooks?: string[] | null;
    favoriteArtists?: string[] | null;
    favoriteFood?: string[] | null;
    hobbies?: string[] | null;
  } | null;
  communication?: {
    conversationLength?: string | null;
    adviceStyle?: string | null;
    prefersHonesty?: boolean | null;
    annoyingConversationStyle?: string | null;
  } | null;
  gwenStyle?: {
    tones?: string[] | null;
    howSheIs?: string[] | null;
    howSheWorks?: string[] | null;
    whenPresent?: string[] | null;
    neverDo?: string | null;
  } | null;
  goals?: {
    currentlyConquering?: string | null;
    dream?: string | null;
    selfImprove?: string | null;
  } | null;
  friendship?: {
    friendshipWithLuan?: string | null;
    whatLuanDoesWell?: string | null;
    whatLuanCouldImprove?: string | null;
    memorableMoment?: string | null;
  } | null;
  aboutYou?: {
    littleKnownFact?: string | null;
    catchphrase?: string | null;
    curiosity?: string | null;
  } | null;
  forGwen?: {
    neverForget?: string | null;
    alwaysAsk?: string | null;
    neverStore?: string | null;
  } | null;
  consent?: boolean | null;
};

const TONE_LABELS: Record<string, string> = {
  divertida: "Mais divertida",
  seria: "Mais séria",
  curiosa: "Mais curiosa",
  objetiva: "Mais objetiva",
  carinhosa: "Mais carinhosa",
  tanto_faz: "Tanto faz",
};

const CONVERSATION_LABELS: Record<string, string> = {
  curtas: "Curtas",
  longas: "Longas",
};

const ADVICE_LABELS: Record<string, string> = {
  diretos: "Bem diretos",
  delicadeza: "Com delicadeza",
  depende: "Depende da situação",
};

function optionMap(options: SelectOption[]) {
  return Object.fromEntries(options.map((o) => [o.value, o.label]));
}

function labelsFrom(
  values: string[] | null | undefined,
  map: Record<string, string>,
) {
  if (!values || values.length === 0) return "Não informado";
  return values.map((value) => map[value] || value).join(", ");
}

function text(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Não informado";
}

function Answer({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="space-y-1.5 border-b border-white/[0.04] pb-4 last:border-b-0 last:pb-0">
      <p className="text-sm text-muted">{question}</p>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
        {answer}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/[0.05] bg-background/40 p-4 sm:p-5">
      <h3 className="font-[family-name:var(--font-fraunces)] text-lg tracking-tight text-accent">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function QuestionnaireReview({
  questionnaire,
}: {
  questionnaire: QuestionnaireView;
}) {
  const personalityMap = optionMap(PERSONALITY_TRAITS);
  const traitsMap = optionMap(DEFINING_TRAITS);
  const happyMap = optionMap(HAPPY_MOMENTS);
  const irritatesMap = optionMap(IRRITATIONS);
  const gamesMap = optionMap(GAME_GENRES);
  const moviesMap = optionMap(MOVIE_GENRES);
  const seriesMap = optionMap(SERIES_GENRES);
  const booksMap = optionMap(BOOK_GENRES);
  const musicMap = optionMap(MUSIC_GENRES);
  const foodMap = optionMap(FOOD_STYLES);
  const hobbiesMap = optionMap(HOBBY_OPTIONS);
  const howSheIsMap = optionMap(GWEN_HOW_SHE_IS);
  const howSheWorksMap = optionMap(GWEN_HOW_SHE_WORKS);
  const whenPresentMap = optionMap(GWEN_WHEN_PRESENT);

  return (
    <div className="mt-5 space-y-4">
      <p className="text-sm text-muted">
        Respondido em {formatDate(questionnaire.submittedAt)}
      </p>

      <Section title="Quem é você">
        <Answer
          question="Nome completo"
          answer={text(questionnaire.whoYouAre?.fullName)}
        />
        <Answer
          question="Como prefere ser chamado?"
          answer={text(questionnaire.whoYouAre?.preferredName)}
        />
        <Answer
          question="Idade"
          answer={
            questionnaire.whoYouAre?.age
              ? String(questionnaire.whoYouAre.age)
              : "Não informado"
          }
        />
        <Answer
          question="Como você conheceu o Luan?"
          answer={text(questionnaire.whoYouAre?.howMetLuan)}
        />
      </Section>

      <Section title="Personalidade">
        <Answer
          question="Como você descreveria sua personalidade?"
          answer={labelsFrom(
            questionnaire.personality?.description,
            personalityMap,
          )}
        />
        <Answer
          question="Quais características mais te definem?"
          answer={labelsFrom(
            questionnaire.personality?.definingTraits,
            traitsMap,
          )}
        />
        <Answer
          question="O que costuma te deixar feliz?"
          answer={labelsFrom(
            questionnaire.personality?.whatMakesHappy,
            happyMap,
          )}
        />
        <Answer
          question="O que costuma te irritar?"
          answer={labelsFrom(
            questionnaire.personality?.whatIrritates,
            irritatesMap,
          )}
        />
      </Section>

      <Section title="Gostos">
        <Answer
          question="Gêneros de jogos"
          answer={labelsFrom(questionnaire.tastes?.favoriteGames, gamesMap)}
        />
        <Answer
          question="Gêneros de filmes"
          answer={labelsFrom(questionnaire.tastes?.favoriteMovies, moviesMap)}
        />
        <Answer
          question="Gêneros de séries"
          answer={labelsFrom(questionnaire.tastes?.favoriteSeries, seriesMap)}
        />
        <Answer
          question="Gêneros de livros"
          answer={labelsFrom(questionnaire.tastes?.favoriteBooks, booksMap)}
        />
        <Answer
          question="Estilos musicais"
          answer={labelsFrom(questionnaire.tastes?.favoriteArtists, musicMap)}
        />
        <Answer
          question="Estilos de comida"
          answer={labelsFrom(questionnaire.tastes?.favoriteFood, foodMap)}
        />
        <Answer
          question="Hobbies"
          answer={labelsFrom(questionnaire.tastes?.hobbies, hobbiesMap)}
        />
      </Section>

      <Section title="Comunicação">
        <Answer
          question="Você prefere conversas:"
          answer={
            CONVERSATION_LABELS[
              questionnaire.communication?.conversationLength || ""
            ] || "Não informado"
          }
        />
        <Answer
          question="Como gosta de receber conselhos?"
          answer={
            ADVICE_LABELS[questionnaire.communication?.adviceStyle || ""] ||
            "Não informado"
          }
        />
        <Answer
          question="Prefere que alguém seja totalmente sincero com você?"
          answer={
            questionnaire.communication?.prefersHonesty == null
              ? "Não informado"
              : questionnaire.communication.prefersHonesty
                ? "Sim"
                : "Não"
          }
        />
        <Answer
          question="Existe alguma forma de conversar que te incomoda?"
          answer={text(questionnaire.communication?.annoyingConversationStyle)}
        />
      </Section>

      <Section title="Como a Gwen deve conversar">
        <Answer
          question="No tom, você gostaria que a Gwen fosse:"
          answer={labelsFrom(questionnaire.gwenStyle?.tones, TONE_LABELS)}
        />
        <Answer
          question="Como gostaria que a Gwen fosse com você?"
          answer={labelsFrom(questionnaire.gwenStyle?.howSheIs, howSheIsMap)}
        />
        <Answer
          question="Como ela deveria funcionar no dia a dia?"
          answer={labelsFrom(
            questionnaire.gwenStyle?.howSheWorks,
            howSheWorksMap,
          )}
        />
        <Answer
          question="Em quais momentos ela deveria estar presente?"
          answer={labelsFrom(
            questionnaire.gwenStyle?.whenPresent,
            whenPresentMap,
          )}
        />
        <Answer
          question="Existe alguma coisa que ela nunca deveria fazer durante uma conversa?"
          answer={text(questionnaire.gwenStyle?.neverDo)}
        />
      </Section>

      <Section title="Objetivos">
        <Answer
          question="O que você está tentando conquistar atualmente?"
          answer={text(questionnaire.goals?.currentlyConquering)}
        />
        <Answer
          question="Existe algum sonho que gostaria de realizar?"
          answer={text(questionnaire.goals?.dream)}
        />
        <Answer
          question="Existe alguma coisa que você gostaria de melhorar em si mesmo?"
          answer={text(questionnaire.goals?.selfImprove)}
        />
      </Section>

      <Section title="Nossa amizade">
        <Answer
          question="Como você descreveria sua amizade com o Luan?"
          answer={text(questionnaire.friendship?.friendshipWithLuan)}
        />
        <Answer
          question="O que você acha que ele faz muito bem?"
          answer={text(questionnaire.friendship?.whatLuanDoesWell)}
        />
        <Answer
          question="Existe alguma coisa que você acha que ele poderia melhorar?"
          answer={text(questionnaire.friendship?.whatLuanCouldImprove)}
        />
        <Answer
          question="Qual foi um momento marcante que vivemos juntos?"
          answer={text(questionnaire.friendship?.memorableMoment)}
        />
      </Section>

      <Section title="Sobre você">
        <Answer
          question="Existe alguma coisa que poucas pessoas sabem sobre você?"
          answer={text(questionnaire.aboutYou?.littleKnownFact)}
        />
        <Answer
          question="Tem alguma frase que você fala bastante?"
          answer={text(questionnaire.aboutYou?.catchphrase)}
        />
        <Answer
          question="Existe alguma curiosidade interessante sobre você?"
          answer={text(questionnaire.aboutYou?.curiosity)}
        />
      </Section>

      <Section title="Para a Gwen">
        <Answer
          question="Existe algo que você gostaria que a Gwen nunca esquecesse sobre você?"
          answer={text(questionnaire.forGwen?.neverForget)}
        />
        <Answer
          question="Existe algum assunto que você gostaria que ela sempre lembrasse de perguntar?"
          answer={text(questionnaire.forGwen?.alwaysAsk)}
        />
        <Answer
          question="Existe alguma informação que você prefere que ela nunca armazene?"
          answer={text(questionnaire.forGwen?.neverStore)}
        />
      </Section>

      <Section title="Consentimento">
        <Answer
          question="Concordou que as informações sejam usadas exclusivamente pela Gwen?"
          answer={
            questionnaire.consent == null
              ? "Não informado"
              : questionnaire.consent
                ? "Sim"
                : "Não"
          }
        />
      </Section>
    </div>
  );
}
