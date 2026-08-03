# Gwen — App Android (TWA)

Este projeto empacota o PWA da Gwen (`https://gwen-plum.vercel.app`) como um
app Android instalável de verdade, usando **Trusted Web Activity** (TWA) via
`androidbrowserhelper`. Não é um app 100% nativo reescrito — é o mesmo site,
rodando dentro de uma "moldura" Android, em tela cheia, com ícone e splash
próprios.

## Por que TWA e não um app nativo do zero?

- Reaproveita 100% do código já feito (Next.js), sem duplicar telas.
- É o caminho oficial do Google/PWABuilder para publicar PWAs na Play Store.
- Mais rápido de manter: qualquer deploy no Vercel já atualiza o app.

## Pré-requisitos

- [Android Studio](https://developer.android.com/studio) instalado (ele traz
  o Android SDK, o Gradle e o JDK certos).
- Este ambiente (sandbox do agente) **não tem o Android SDK**, então o build
  do `.apk`/`.aab` precisa ser feito na sua máquina, no Android Studio.

## Como buildar

1. Abra a pasta `android/` no Android Studio (**File → Open**). Ele vai
   detectar que falta o Gradle Wrapper e oferecer para criar — aceite.
2. Deixe o Gradle sincronizar (primeira vez baixa dependências).
3. Rode em um emulador/aparelho com **Run ▶** para testar.
4. Para gerar o app final: **Build → Generate Signed Bundle / APK**.
   - Crie um keystore novo (guarde a senha e o arquivo com muito cuidado —
     sem ele você não consegue atualizar o app depois).
   - Escolha **APK** (para instalar direto no seu celular) ou **Android App
     Bundle** (formato que a Play Store pede).

## Deixar em tela cheia (sem barra de URL do Chrome)

Isso só acontece depois que o Google verificar que o app e o site são "a
mesma coisa", via **Digital Asset Links**. Passos:

1. Depois de criar o keystore, pegue o fingerprint SHA-256:

   ```bash
   keytool -list -v -keystore caminho/para/seu.keystore -alias seu-alias
   ```

2. Copie o valor de `SHA256:` (sem os dois-pontos, tudo maiúsculo é ok) e
   cole em `public/.well-known/assetlinks.json`, no lugar de
   `SUBSTITUA_PELO_SHA256_DO_SEU_KEYSTORE`.
3. Faça commit, push e espere o redeploy do Vercel.
4. Confirme que `https://gwen-plum.vercel.app/.well-known/assetlinks.json`
   está acessível e com o valor certo.
5. Reinstale o app — agora ele deve abrir em tela cheia, parecendo nativo.

## Instalar no celular sem Play Store

1. Gere um `.apk` assinado (passo acima).
2. Transfira para o celular (cabo, Drive, etc.).
3. No Android, permita "instalar apps de fontes desconhecidas" para o app
   usado para abrir o arquivo.
4. Toque no `.apk` para instalar.

## Widget de tela inicial

A Fase 5 adiciona um widget nativo que mostra:

- seu humor mais recente
- a próxima lembrança aberta
- quantas lembranças ainda estão abertas

### Como conectar

1. No site (`/configuracoes`), gere o **token do widget**.
2. Build/instale o APK (ver acima).
3. Na tela inicial do Android: **Widgets → Gwen**.
4. Na tela de configuração, cole a URL (`https://gwen-plum.vercel.app`)
   e o token.
5. Toque em **Salvar e conectar**.

O widget atualiza sozinho a cada ~30 minutos, ou na hora se você tocar no
ícone de atualizar.

API usada: `GET /api/widget` com `Authorization: Bearer <token>`.

## Próximos passos (fora deste projeto por enquanto)

- **Publicar na Play Store**: precisa de conta de desenvolvedor Google
  (taxa única) e passar pela revisão deles.
- Acompanhar o polimento da Companion completa no próprio PWA (insights,
  midia, etc.).
