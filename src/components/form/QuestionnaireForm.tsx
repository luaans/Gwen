"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { cn } from "@/utils/cn";

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
    description: "",
    definingTraits: "",
    whatMakesHappy: "",
    whatIrritates: "",
  },
  tastes: {
    favoriteGames: "",
    favoriteMovies: "",
    favoriteSeries: "",
    favoriteBooks: "",
    favoriteArtists: "",
    favoriteFood: "",
    hobbies: "",
  },
  communication: {
    conversationLength: "longas",
    adviceStyle: "depende",
    prefersHonesty: "sim",
    annoyingConversationStyle: "",
  },
  gwenStyle: {
    tones: ["carinhosa"],
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
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-card text-muted hover:border-accent/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function QuestionnaireForm({ token }: { token: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const form = useForm<QuestionnaireInput>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues,
    mode: "onTouched",
  });

  const {
    register,
    control,
    trigger,
    handleSubmit,
    formState: { errors },
  } = form;

  async function next() {
    const fieldsByStep: Array<(keyof QuestionnaireInput)[]> = [
      ["whoYouAre"],
      ["personality"],
      ["tastes"],
      ["communication"],
      ["gwenStyle"],
      ["goals"],
      ["friendship"],
      ["aboutYou"],
      ["forGwen"],
      ["consent"],
    ];
    const valid = await trigger(fieldsByStep[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function onSubmit(data: QuestionnaireInput) {
    setError(null);
    startTransition(async () => {
      const result = await submitQuestionnaireAction(token, data);
      if (!result.success) {
        setError(result.error || "Não foi possível enviar");
        return;
      }
      router.push(
        `/conhecendo/obrigado?nome=${encodeURIComponent(result.data?.personName || "")}`,
      );
    });
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <Textarea
                label="Como você descreveria sua personalidade?"
                {...register("personality.description")}
                error={errors.personality?.description?.message}
              />
              <Textarea
                label="Quais características mais te definem?"
                {...register("personality.definingTraits")}
                error={errors.personality?.definingTraits?.message}
              />
              <Textarea
                label="O que costuma te deixar feliz?"
                {...register("personality.whatMakesHappy")}
                error={errors.personality?.whatMakesHappy?.message}
              />
              <Textarea
                label="O que costuma te irritar?"
                {...register("personality.whatIrritates")}
                error={errors.personality?.whatIrritates?.message}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Input label="Jogos favoritos" {...register("tastes.favoriteGames")} />
              <Input label="Filmes favoritos" {...register("tastes.favoriteMovies")} />
              <Input label="Séries favoritas" {...register("tastes.favoriteSeries")} />
              <Input label="Livros favoritos" {...register("tastes.favoriteBooks")} />
              <Input
                label="Artistas ou bandas favoritas"
                {...register("tastes.favoriteArtists")}
              />
              <Input label="Comida favorita" {...register("tastes.favoriteFood")} />
              <Textarea label="Hobbies" {...register("tastes.hobbies")} />
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
                  Você gostaria que a Gwen fosse:
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
            <div className="space-y-4">
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
          )}
        </motion.div>
      </AnimatePresence>

      {error ? (
        <p className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="flex gap-3 pt-2">
        {step > 0 ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 sm:flex-none"
          >
            Voltar
          </Button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            onClick={next}
            className="flex-1 sm:flex-none sm:ml-auto"
          >
            Continuar
          </Button>
        ) : (
          <Button
            type="submit"
            loading={pending}
            className="flex-1 sm:flex-none sm:ml-auto"
          >
            Enviar para a Gwen
          </Button>
        )}
      </div>
    </form>
  );
}
