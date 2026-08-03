# Gwen

Companion digital pessoal.

## Setup

1. Copie `.env.local.example` para `.env.local`
2. Preencha:

```
MONGODB_URI=sua_connection_string_do_atlas
DATABASE_NAME=gwen
NEXTAUTH_SECRET=uma-string-aleatoria-longa
NEXTAUTH_URL=http://localhost:3000
OWNER_NAME=Luan Silva
OWNER_EMAIL=seu@email.com
OWNER_PASSWORD=sua-senha
OPENAI_API_KEY=                    # opcional — conversas com IA
OPENAI_MODEL=gpt-4o-mini           # opcional
```

3. Instale e rode:

```bash
npm install
npm run dev
```

## O que já existe

- Pessoas importantes + formulário público (primeiro encontro)
- Perfil completo com todas as respostas
- Memórias por pessoa
- Resumo vivo (gerado do questionário)
- Conversas com a Gwen (contextual; com OpenAI se houver chave; voz por reconhecimento e TTS)
- Check-ins de humor (`/humor`) + detecção de humor nas conversas
- Lembranças vivas (`/lembrancas`), sincronizadas a partir das lacunas do formulário
- Diário de acontecimentos
- Configurações (link de convite, nome)
- PWA instalável (manifest + service worker)
- App Android via TWA (ver `android/README.md`)
- Widget de tela inicial (humor + próxima lembrança)

## Rotas

| Rota | Quem |
|------|------|
| `/` | Landing |
| `/entrar` | Login do Luan |
| `/dashboard` | Pessoas importantes |
| `/conversas` | Conversas recentes |
| `/diario` | Journal |
| `/configuracoes` | Ajustes |
| `/pessoas/nova` | Apresentar alguém |
| `/pessoas/[id]` | Perfil |
| `/pessoas/[id]/conversa` | Chat com a Gwen |
| `/pessoas/[id]/editar` | Editar + foto |
| `/conhecendo/[token]` | Formulário público |
| `/humor` | Check-ins de humor |
| `/lembrancas` | Lembranças abertas |

## Filosofia

A Gwen não trata pessoas como registros. Cada pessoa é uma história em construção.
