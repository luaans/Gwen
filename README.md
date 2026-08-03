# Gwen

Companion digital pessoal — Fase 1: fundação.

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
```

3. Instale e rode:

```bash
npm install
npm run dev
```

Na primeira execução, a Gwen cria automaticamente:

- o usuário proprietário (Luan Silva)
- as coleções no MongoDB Atlas
- o token único do formulário
- a primeira entrada no Journal

## Rotas

| Rota | Quem |
|------|------|
| `/` | Landing |
| `/entrar` | Login do Luan |
| `/dashboard` | Pessoas importantes |
| `/pessoas/nova` | Apresentar alguém |
| `/pessoas/[id]` | Perfil |
| `/pessoas/[id]/editar` | Editar + foto |
| `/conhecendo/[token]` | Formulário público (link único) |

## Filosofia

A Gwen não trata pessoas como registros. Cada pessoa é uma história em construção.
