"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  questionnaireSchema,
  type QuestionnaireInput,
} from "@/lib/validations";
import { submitQuestionnaireAction } from "@/actions/questionnaire.actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { FormThanksCard } from "@/components/form/FormThanksCard";
import { cn } from "@/utils/cn";
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
} from "@/lib/form-options";

const STEPS = [
  { id: 0, title: "Quem é você", description: "O começo de tudo" },
  { id: 1, title: "Personalidade", description: "Como você é" },
  { id: 2, title: "Gostos", description: "O que te anima" },
  { id: 3, title: "Comunicação", description: "Como conversar com você" },
  { id: 4, title: "Com a Gwen", description: "O tom certo" },
  { id: 5, title: "Objetivos", description: "Para onde você vai" },
  { id: 6, title: "Nossa amizade", description: "Você e o Luan" },
  { id: 7, title: "Sobre você", description: "Detalhes especiais" },
  { id: 8, title: "Para a Gwen", description: "Memórias importantes" },
  { id: 9, title: "Consentimento", description: "Com cuidado" },
];

const TONE_OPTIONS = [
  { value: "divertida", label: "Mais divertida" },
  { value: "seria", label: "Mais séria" },
  { value: "curiosa", label: "Mais curiosa" },
  { value: "objetiva", label: "Mais objetiva" },
  { value: "carinhosa", label: "Mais carinhosa" },
  { value: "tanto_faz", label: "Tanto faz" },
] as const;

const defaultValues: QuestionnaireInput = {
  whoYouAre: {
    fullName: "",
    preferredName: "",
    age: "",
    howMetLuan: "",
  },
  personality: {
    description: [],
    definingTraits: [],
    whatMakesHappy: [],
    whatIrritates: [],
  },
  tastes: {
    favoriteGames: [],
    favoriteMovies: [],
    favoriteSeries: [],
    favoriteBooks: [],
    favoriteArtists: [],
    favoriteFood: [],
    hobbies: [],
  },
  communication: {
    conversationLength: "longas",
    adviceStyle: "depende",
    prefersHonesty: "sim",
    annoyingConversationStyle: "",
  },
  gwenStyle: {
    tones: ["carinhosa"],
    howSheIs: [],
    howSheWorks: [],
    whenPresent: [],
    neverDo: "",
  },
  goals: {
    currentlyConquering: "",
    dream: "",
    selfImprove: "",
  },
  friendship: {
    friendshipWithLuan: "",
    whatLuanDoesWell: "",
    whatLuanCouldImprove: "",
    memorableMoment: "",
  },
  aboutYou: {
    littleKnownFact: "",
    catchphrase: "",
    curiosity: "",
  },
  forGwen: {
    neverForget: "",
    alwaysAsk: "",
    neverStore: "",
  },
  consent: "sim",
};

function ChoiceCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border px-4 py-3 text-left text-sm transition",
        selected
          ? "border-accent/40 bg-accent-soft text-accent"
          : "border-white/[0.06] bg-card/60 text-muted hover:border-accent/25 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

const FIELDS_BY_STEP: Array<keyof QuestionnaireInput> = [
  "whoYouAre",
  "personality",
  "tastes",
  "communication",
  "gwenStyle",
  "goals",
  "friendship",
  "aboutYou",
  "forGwen",
  "consent",
];

export function QuestionnaireForm({
  token,
  prefillFullName = "",
  onCompleted,
}: {
  token: string;
  prefillFullName?: string;
  onCompleted: (personId: string, personName: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [consentAnswered, setConsentAnswered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const form = useForm<QuestionnaireInput>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      ...defaultValues,
      whoYouAre: {
        ...defaultValues.whoYouAre,
        fullName: prefillFullName,
      },
    },
    mode: "onSubmit",
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const consentValue = watch("consent");

  function goNext() {
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    if (step === STEPS.length - 1 && consentAnswered) {
      setConsentAnswered(false);
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
  }

  function findFirstIncompleteStep(formErrors: typeof errors): number {
    return FIELDS_BY_STEP.findIndex((field) => Boolean(formErrors[field]));
  }

  function onInvalid(formErrors: typeof errors) {
    setConsentAnswered(false);
    const firstIncomplete = findFirstIncompleteStep(formErrors);
    if (firstIncomplete >= 0) {
      setStep(firstIncomplete);
      setError(
        `Ainda faltam algumas respostas em “${STEPS[firstIncomplete].title}”. Você pode navegar livremente, mas para enviar é preciso completar o que for obrigatório.`,
      );
      return;
    }
    setError("Revise as respostas antes de enviar.");
  }

  function onSubmit(data: QuestionnaireInput) {
    setError(null);
    startTransition(async () => {
      const result = await submitQuestionnaireAction(token, data);
      if (!result.success || !result.data) {
        setError(result.error || "Não foi possível enviar");
        return;
      }
      onCompleted(
        result.data.personId,
        result.data.personName || data.whoYouAre.preferredName,
      );
    });
  }

  const progress = ((step + 1) / STEPS.length) * 100;
  const isLastStep = step === STEPS.length - 1;
  const canSubmit = isLastStep && consentAnswered && consentValue === "sim";

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="space-y-6"
    >
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-muted">
          <span>
            Seção {step + 1} de {STEPS.length}
          </span>
          <span>{STEPS[step].title}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full rounded-full bg-accent"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div>
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl tracking-tight">
              {STEPS[step].title}
            </h2>
            <p className="mt-1 text-sm text-muted">{STEPS[step].description}</p>
          </div>

          {step === 0 && (
            <>
              <Input
                label="Nome completo"
                {...register("whoYouAre.fullName")}
                error={errors.whoYouAre?.fullName?.message}
              />
              <Input
                label="Como prefere ser chamado?"
                {...register("whoYouAre.preferredName")}
                error={errors.whoYouAre?.preferredName?.message}
              />
              <Input
                label="Idade (opcional)"
                type="number"
                {...register("whoYouAre.age")}
              />
              <Textarea
                label="Como você conheceu o Luan?"
                {...register("whoYouAre.howMetLuan")}
                error={errors.whoYouAre?.howMetLuan?.message}
              />
            </>
          )}

          {step === 1 && (
            <>
              <Controller
                control={control}
                name="personality.description"
                render={({ field }) => (
                  <MultiSelect
                    label="Como você descreveria sua personalidade?"
                    options={PERSONALITY_TRAITS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Escolha uma ou mais…"
                    error={errors.personality?.description?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="personality.definingTraits"
                render={({ field }) => (
                  <MultiSelect
                    label="Quais características mais te definem?"
                    options={DEFINING_TRAITS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Escolha uma ou mais…"
                    error={errors.personality?.definingTraits?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="personality.whatMakesHappy"
                render={({ field }) => (
                  <MultiSelect
                    label="O que costuma te deixar feliz?"
                    options={HAPPY_MOMENTS}
                    value={field.value || []}
                    onChange={field.onChange}
                    optional
                    hint="Pode deixar em branco se preferir."
                    placeholder="Selecionar (opcional)…"
                  />
                )}
              />
              <Controller
                control={control}
                name="personality.whatIrritates"
                render={({ field }) => (
                  <MultiSelect
                    label="O que costuma te irritar?"
                    options={IRRITATIONS}
                    value={field.value || []}
                    onChange={field.onChange}
                    optional
                    hint="Em branco também diz algo — a Gwen pode perguntar depois."
                    placeholder="Selecionar (opcional)…"
                  />
                )}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Controller
                control={control}
                name="tastes.favoriteGames"
                render={({ field }) => (
                  <MultiSelect
                    label="Gêneros de jogos que mais gosta"
                    options={GAME_GENRES}
                    value={field.value || []}
                    onChange={field.onChange}
                    optional
                    hint="Pode deixar em branco."
                    placeholder="Selecionar gêneros…"
                  />
                )}
              />
              <Controller
                control={control}
                name="tastes.favoriteMovies"
                render={({ field }) => (
                  <MultiSelect
                    label="Gêneros de filmes favoritos"
                    options={MOVIE_GENRES}
                    value={field.value || []}
                    onChange={field.onChange}
                    optional
                    placeholder="Selecionar gêneros…"
                  />
                )}
              />
              <Controller
                control={control}
                name="tastes.favoriteSeries"
                render={({ field }) => (
                  <MultiSelect
                    label="Gêneros de séries favoritas"
                    options={SERIES_GENRES}
                    value={field.value || []}
                    onChange={field.onChange}
                    optional
                    placeholder="Selecionar gêneros…"
                  />
                )}
              />
              <Controller
                control={control}
                name="tastes.favoriteBooks"
                render={({ field }) => (
                  <MultiSelect
                    label="Gêneros de livros favoritos"
                    options={BOOK_GENRES}
                    value={field.value || []}
                    onChange={field.onChange}
                    optional
                    placeholder="Selecionar gêneros…"
                  />
                )}
              />
              <Controller
                control={control}
                name="tastes.favoriteArtists"
                render={({ field }) => (
                  <MultiSelect
                    label="Estilos musicais favoritos"
                    options={MUSIC_GENRES}
                    value={field.value || []}
                    onChange={field.onChange}
                    optional
                    placeholder="Selecionar estilos…"
                  />
                )}
              />
              <Controller
                control={control}
                name="tastes.favoriteFood"
                render={({ field }) => (
                  <MultiSelect
                    label="Estilos de comida favoritos"
                    options={FOOD_STYLES}
                    value={field.value || []}
                    onChange={field.onChange}
                    optional
                    placeholder="Selecionar…"
                  />
                )}
              />
              <Controller
                control={control}
                name="tastes.hobbies"
                render={({ field }) => (
                  <MultiSelect
                    label="Hobbies"
                    options={HOBBY_OPTIONS}
                    value={field.value || []}
                    onChange={field.onChange}
                    optional
                    placeholder="Selecionar…"
                  />
                )}
              />
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <p className="text-sm text-muted">Você prefere conversas:</p>
                <Controller
                  control={control}
                  name="communication.conversationLength"
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-2">
                      <ChoiceCard
                        selected={field.value === "curtas"}
                        onClick={() => field.onChange("curtas")}
                      >
                        Curtas
                      </ChoiceCard>
                      <ChoiceCard
                        selected={field.value === "longas"}
                        onClick={() => field.onChange("longas")}
                      >
                        Longas
                      </ChoiceCard>
                    </div>
                  )}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted">Como gosta de receber conselhos?</p>
                <Controller
                  control={control}
                  name="communication.adviceStyle"
                  render={({ field }) => (
                    <div className="grid gap-2">
                      {[
                        ["diretos", "Bem diretos"],
                        ["delicadeza", "Com delicadeza"],
                        ["depende", "Depende da situação"],
                      ].map(([value, label]) => (
                        <ChoiceCard
                          key={value}
                          selected={field.value === value}
                          onClick={() => field.onChange(value)}
                        >
                          {label}
                        </ChoiceCard>
                      ))}
                    </div>
                  )}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted">
                  Você prefere que alguém seja totalmente sincero com você?
                </p>
                <Controller
                  control={control}
                  name="communication.prefersHonesty"
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-2">
                      <ChoiceCard
                        selected={field.value === "sim"}
                        onClick={() => field.onChange("sim")}
                      >
                        Sim
                      </ChoiceCard>
                      <ChoiceCard
                        selected={field.value === "nao"}
                        onClick={() => field.onChange("nao")}
                      >
                        Não
                      </ChoiceCard>
                    </div>
                  )}
                />
              </div>
              <Textarea
                label="Existe alguma forma de conversar que te incomoda?"
                {...register("communication.annoyingConversationStyle")}
              />
            </>
          )}

          {step === 4 && (
            <>
              <div className="space-y-2">
                <p className="text-sm text-muted">
                  No tom, você gostaria que a Gwen fosse:
                </p>
                <Controller
                  control={control}
                  name="gwenStyle.tones"
                  render={({ field }) => (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {TONE_OPTIONS.map((option) => {
                        const selected = field.value.includes(option.value);
                        return (
                          <ChoiceCard
                            key={option.value}
                            selected={selected}
                            onClick={() => {
                              if (selected) {
                                field.onChange(
                                  field.value.filter((v) => v !== option.value),
                                );
                              } else {
                                field.onChange([...field.value, option.value]);
                              }
                            }}
                          >
                            {option.label}
                          </ChoiceCard>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.gwenStyle?.tones?.message ? (
                  <p className="text-xs text-danger">
                    {errors.gwenStyle.tones.message}
                  </p>
                ) : null}
              </div>

              <Controller
                control={control}
                name="gwenStyle.howSheIs"
                render={({ field }) => (
                  <MultiSelect
                    label="Como gostaria que a Gwen fosse com você?"
                    options={GWEN_HOW_SHE_IS}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Selecionar…"
                    error={errors.gwenStyle?.howSheIs?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="gwenStyle.howSheWorks"
                render={({ field }) => (
                  <MultiSelect
                    label="Como ela deveria funcionar no dia a dia?"
                    options={GWEN_HOW_SHE_WORKS}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Selecionar…"
                    error={errors.gwenStyle?.howSheWorks?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="gwenStyle.whenPresent"
                render={({ field }) => (
                  <MultiSelect
                    label="Em quais momentos ela deveria estar presente?"
                    options={GWEN_WHEN_PRESENT}
                    value={field.value || []}
                    onChange={field.onChange}
                    optional
                    hint="Pode deixar em branco."
                    placeholder="Selecionar (opcional)…"
                  />
                )}
              />

              <Textarea
                label="Existe alguma coisa que ela nunca deveria fazer durante uma conversa?"
                {...register("gwenStyle.neverDo")}
              />
            </>
          )}

          {step === 5 && (
            <>
              <Textarea
                label="O que você está tentando conquistar atualmente?"
                {...register("goals.currentlyConquering")}
              />
              <Textarea
                label="Existe algum sonho que gostaria de realizar?"
                {...register("goals.dream")}
              />
              <Textarea
                label="Existe alguma coisa que você gostaria de melhorar em si mesmo?"
                {...register("goals.selfImprove")}
              />
            </>
          )}

          {step === 6 && (
            <>
              <Textarea
                label="Como você descreveria sua amizade com o Luan?"
                {...register("friendship.friendshipWithLuan")}
              />
              <Textarea
                label="O que você acha que ele faz muito bem?"
                {...register("friendship.whatLuanDoesWell")}
              />
              <Textarea
                label="Existe alguma coisa que você acha que ele poderia melhorar?"
                {...register("friendship.whatLuanCouldImprove")}
              />
              <Textarea
                label="Qual foi um momento marcante que vivemos juntos?"
                {...register("friendship.memorableMoment")}
              />
            </>
          )}

          {step === 7 && (
            <>
              <Textarea
                label="Existe alguma coisa que poucas pessoas sabem sobre você?"
                {...register("aboutYou.littleKnownFact")}
              />
              <Input
                label="Tem alguma frase que você fala bastante?"
                {...register("aboutYou.catchphrase")}
              />
              <Textarea
                label="Existe alguma curiosidade interessante sobre você?"
                {...register("aboutYou.curiosity")}
              />
            </>
          )}

          {step === 8 && (
            <>
              <Textarea
                label="Existe algo que você gostaria que a Gwen nunca esquecesse sobre você?"
                {...register("forGwen.neverForget")}
              />
              <Textarea
                label="Existe algum assunto que você gostaria que ela sempre lembrasse de perguntar?"
                {...register("forGwen.alwaysAsk")}
              />
              <Textarea
                label="Existe alguma informação que você prefere que ela nunca armazene?"
                {...register("forGwen.neverStore")}
              />
            </>
          )}

          {step === 9 && (
            <div className="space-y-5">
              {!consentAnswered ? (
                <>
                  <p className="text-sm leading-relaxed text-muted">
                    Você concorda que essas informações sejam utilizadas
                    exclusivamente pela Gwen para tornar futuras conversas mais
                    naturais?
                  </p>
                  <Controller
                    control={control}
                    name="consent"
                    render={({ field }) => (
                      <div className="grid grid-cols-2 gap-2">
                        <ChoiceCard
                          selected={field.value === "sim"}
                          onClick={() => {
                            field.onChange("sim");
                            setConsentAnswered(true);
                          }}
                        >
                          Sim
                        </ChoiceCard>
                        <ChoiceCard
                          selected={field.value === "nao"}
                          onClick={() => {
                            field.onChange("nao");
                            setConsentAnswered(true);
                          }}
                        >
                          Não
                        </ChoiceCard>
                      </div>
                    )}
                  />
                </>
              ) : (
                <>
                  <FormThanksCard />
                  {consentValue === "nao" ? (
                    <p className="rounded-2xl border border-white/[0.06] bg-card/50 px-4 py-3 text-sm text-muted">
                      Sem o seu consentimento, a Gwen não guarda essas histórias.
                      Tudo bem — obrigado por considerar.
                    </p>
                  ) : (
                    <p className="text-sm text-muted">
                      Quando estiver pronto, envie suas respostas para a Gwen.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {error ? (
        <p className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="flex gap-3 pt-2">
        {step > 0 || consentAnswered ? (
          <Button
            type="button"
            variant="secondary"
            onClick={goBack}
            className="flex-1 sm:flex-none"
          >
            Voltar
          </Button>
        ) : null}
        {!isLastStep ? (
          <Button
            type="button"
            onClick={goNext}
            className="flex-1 sm:flex-none sm:ml-auto"
          >
            Continuar
          </Button>
        ) : canSubmit ? (
          <Button
            type="submit"
            loading={pending}
            className="flex-1 sm:flex-none sm:ml-auto"
          >
            Enviar para a Gwen
          </Button>
        ) : null}
      </div>
    </form>
  );
}
