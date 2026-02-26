# Jarvis

Voice AI web app built with Next.js 14. Jarvis lets you speak through your microphone, get a concise assistant response, and hear the answer as synthesized speech.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create environment file:

   ```bash
   cp .env.local.example .env.local
   ```

3. Add your key in `.env.local`:

   ```env
   OPENAI_API_KEY=...
   OPENAI_MODEL=gpt-4.1-mini
   OPENAI_TTS_VOICE=alloy
   OPENAI_STT_MODEL=whisper-1
   ```

4. Run development server:

   ```bash
   npm run dev
   ```

## Voice mode

Open [http://localhost:3000/voice](http://localhost:3000/voice).

What `/voice` does:
- Fullscreen voice-mode UI with statuses: `Idle`, `Listening`, `Thinking`, `Speaking`, `Error`.
- Start records your microphone.
- Stop finalizes recording and runs STT → chat → TTS flow.
- Mute toggles playback of synthesized audio (does not affect microphone capture).
- Clear resets messages and returns UI to idle.
- Compact chat history stores up to 20 non-system messages in the browser state.

## API endpoints

- `POST /api/stt` — accepts multipart audio and returns `{ "text": "..." }`
- `POST /api/chat` — accepts chat messages and returns `{ "reply": "..." }`
- `POST /api/tts` — accepts text and returns `audio/mpeg` bytes

If `OPENAI_API_KEY` is missing, server APIs return:

```json
{ "error": "Missing API key" }
```

## Troubleshooting

If you see this startup error on Windows:

`Configuring Next.js via 'next.config.ts' is not supported`

- keep only `next.config.js` in the project root
- remove `next.config.ts` if it exists
- run `npm run dev` again

A safety script now runs before `dev` and automatically renames `next.config.ts` to `next.config.js` when possible.
