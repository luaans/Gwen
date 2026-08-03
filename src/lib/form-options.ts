export type SelectOption = { value: string; label: string };

export const PERSONALITY_TRAITS: SelectOption[] = [
  { value: "extrovertido", label: "Extrovertido(a)" },
  { value: "introvertido", label: "Introvertido(a)" },
  { value: "calmo", label: "Calmo(a)" },
  { value: "energico", label: "Enérgico(a)" },
  { value: "romantico", label: "Romântico(a)" },
  { value: "racional", label: "Racional" },
  { value: "sensivel", label: "Sensível" },
  { value: "brincalhao", label: "Brincalhão(ã)" },
  { value: "serio", label: "Sério(a)" },
  { value: "curioso", label: "Curioso(a)" },
  { value: "criativo", label: "Criativo(a)" },
  { value: "organizado", label: "Organizado(a)" },
  { value: "espontaneo", label: "Espontâneo(a)" },
  { value: "observador", label: "Observador(a)" },
  { value: "leal", label: "Leal" },
  { value: "empatico", label: "Empático(a)" },
];

export const DEFINING_TRAITS: SelectOption[] = [
  { value: "honestidade", label: "Honestidade" },
  { value: "humor", label: "Bom humor" },
  { value: "paciencia", label: "Paciência" },
  { value: "determinacao", label: "Determinação" },
  { value: "gentileza", label: "Gentileza" },
  { value: "inteligencia", label: "Inteligência" },
  { value: "coragem", label: "Coragem" },
  { value: "criatividade", label: "Criatividade" },
  { value: "disciplina", label: "Disciplina" },
  { value: "empatia", label: "Empatia" },
  { value: "resiliencia", label: "Resiliência" },
  { value: "sinceridade", label: "Sinceridade" },
  { value: "cuidado", label: "Cuidado com os outros" },
  { value: "ambicao", label: "Ambição" },
];

export const HAPPY_MOMENTS: SelectOption[] = [
  { value: "amigos", label: "Estar com amigos" },
  { value: "familia", label: "Família" },
  { value: "musica", label: "Música" },
  { value: "jogos", label: "Jogos" },
  { value: "filmes", label: "Filmes e séries" },
  { value: "natureza", label: "Natureza" },
  { value: "comida", label: "Comer bem" },
  { value: "viajar", label: "Viajar" },
  { value: "aprender", label: "Aprender algo novo" },
  { value: "silencio", label: "Momentos em silêncio" },
  { value: "conquistas", label: "Conquistas pessoais" },
  { value: "carinho", label: "Receber carinho" },
];

export const IRRITATIONS: SelectOption[] = [
  { value: "mentira", label: "Mentira" },
  { value: "atraso", label: "Atraso" },
  { value: "desorganizacao", label: "Desorganização" },
  { value: "interrupcao", label: "Ser interrompido(a)" },
  { value: "falta_respeito", label: "Falta de respeito" },
  { value: "passivo_agressivo", label: "Tom passivo-agressivo" },
  { value: "pressao", label: "Pressão desnecessária" },
  { value: "barulho", label: "Barulho demais" },
  { value: "injustica", label: "Injustiça" },
  { value: "indiferenca", label: "Indiferença" },
];

export const GAME_GENRES: SelectOption[] = [
  { value: "rpg", label: "RPG" },
  { value: "fps", label: "FPS / Tiro" },
  { value: "aventura", label: "Aventura" },
  { value: "estrategia", label: "Estratégia" },
  { value: "esporte", label: "Esporte" },
  { value: "corrida", label: "Corrida" },
  { value: "luta", label: "Luta" },
  { value: "terror", label: "Terror" },
  { value: "simulacao", label: "Simulação" },
  { value: "indie", label: "Indie" },
  { value: "moba", label: "MOBA" },
  { value: "mundo_aberto", label: "Mundo aberto" },
  { value: "nao_jogo", label: "Não costumo jogar" },
];

export const MOVIE_GENRES: SelectOption[] = [
  { value: "acao", label: "Ação" },
  { value: "aventura", label: "Aventura" },
  { value: "comedia", label: "Comédia" },
  { value: "drama", label: "Drama" },
  { value: "romance", label: "Romance" },
  { value: "terror", label: "Terror" },
  { value: "suspense", label: "Suspense" },
  { value: "ficcao", label: "Ficção científica" },
  { value: "fantasia", label: "Fantasia" },
  { value: "animacao", label: "Animação" },
  { value: "documentario", label: "Documentário" },
  { value: "thriller", label: "Thriller" },
];

export const SERIES_GENRES: SelectOption[] = [
  { value: "drama", label: "Drama" },
  { value: "comedia", label: "Comédia" },
  { value: "crime", label: "Crime / Policial" },
  { value: "fantasia", label: "Fantasia" },
  { value: "ficcao", label: "Ficção científica" },
  { value: "anime", label: "Anime" },
  { value: "reality", label: "Reality" },
  { value: "romance", label: "Romance" },
  { value: "terror", label: "Terror" },
  { value: "documentario", label: "Documentário" },
  { value: "slice_of_life", label: "Slice of life" },
];

export const BOOK_GENRES: SelectOption[] = [
  { value: "ficcao", label: "Ficção" },
  { value: "nao_ficcao", label: "Não ficção" },
  { value: "fantasia", label: "Fantasia" },
  { value: "romance", label: "Romance" },
  { value: "autoajuda", label: "Autoajuda" },
  { value: "biografia", label: "Biografia" },
  { value: "misterio", label: "Mistério" },
  { value: "poesia", label: "Poesia" },
  { value: "tecnico", label: "Técnico / Estudos" },
  { value: "nao_leio", label: "Não costumo ler" },
];

export const MUSIC_GENRES: SelectOption[] = [
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "mpb", label: "MPB" },
  { value: "sertanejo", label: "Sertanejo" },
  { value: "funk", label: "Funk" },
  { value: "rap", label: "Rap / Hip hop" },
  { value: "eletronica", label: "Eletrônica" },
  { value: "indie", label: "Indie" },
  { value: "metal", label: "Metal" },
  { value: "jazz", label: "Jazz" },
  { value: "classica", label: "Clássica" },
  { value: "gospel", label: "Gospel" },
  { value: "kpop", label: "K-pop" },
];

export const FOOD_STYLES: SelectOption[] = [
  { value: "brasileira", label: "Brasileira" },
  { value: "italiana", label: "Italiana" },
  { value: "japonesa", label: "Japonesa" },
  { value: "mexicana", label: "Mexicana" },
  { value: "arabe", label: "Árabe" },
  { value: "fast_food", label: "Fast food" },
  { value: "doce", label: "Doces / Sobremesas" },
  { value: "vegetariana", label: "Vegetariana" },
  { value: "vegana", label: "Vegana" },
  { value: "caseira", label: "Comida caseira" },
];

export const HOBBY_OPTIONS: SelectOption[] = [
  { value: "games", label: "Games" },
  { value: "esportes", label: "Esportes" },
  { value: "musica", label: "Música" },
  { value: "leitura", label: "Leitura" },
  { value: "filmes", label: "Filmes / Séries" },
  { value: "desenho", label: "Desenho / Arte" },
  { value: "culinaria", label: "Culinária" },
  { value: "fotografia", label: "Fotografia" },
  { value: "academia", label: "Academia" },
  { value: "viagens", label: "Viagens" },
  { value: "tecnologia", label: "Tecnologia" },
  { value: "colecionar", label: "Colecionar coisas" },
];

export const GWEN_HOW_SHE_IS: SelectOption[] = [
  { value: "amiga_proxima", label: "Como uma amiga bem próxima" },
  { value: "companheira_cuidadosa", label: "Companheira cuidadosa" },
  { value: "confidente", label: "Uma confidente" },
  { value: "parceira_leve", label: "Parceira leve e divertida" },
  { value: "presenca_discreta", label: "Presença discreta" },
  { value: "alguem_sincera", label: "Alguém bem sincera" },
];

export const GWEN_HOW_SHE_WORKS: SelectOption[] = [
  { value: "perguntar_dia", label: "Perguntar como foi o dia" },
  { value: "lembrar_momentos", label: "Lembrar momentos importantes" },
  { value: "conversar_livre", label: "Conversar sem motivo específico" },
  { value: "apoiar_metas", label: "Acompanhar metas e sonhos" },
  { value: "cuidar_humor", label: "Perceber mudanças de humor" },
  { value: "sugerir_ideias", label: "Sugerir ideias e curiosidades" },
  { value: "so_quando_chamar", label: "Só agir quando eu procurar" },
];

export const GWEN_WHEN_PRESENT: SelectOption[] = [
  { value: "todos_dias", label: "Quase todo dia" },
  { value: "quando_triste", label: "Quando eu estiver pra baixo" },
  { value: "quando_feliz", label: "Em momentos felizes" },
  { value: "datas_especiais", label: "Em datas especiais" },
  { value: "só_se_chamar", label: "Só se eu chamar" },
  { value: "varia", label: "Depende do momento" },
];
