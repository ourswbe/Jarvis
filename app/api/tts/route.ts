import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/serverOpenai';

type TtsRequestPayload = {
  text?: string;
  voice?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as TtsRequestPayload;
    const text = payload.text?.trim();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const client = getOpenAIClient();
    const voice = payload.voice || process.env.OPENAI_TTS_VOICE || 'alloy';

    const audioResponse = await client.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice,
      input: text,
      response_format: 'mp3'
    });

    const buffer = Buffer.from(await audioResponse.arrayBuffer());

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store'
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'TTS service error';
    if (message === 'Missing API key') {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to synthesize speech' }, { status: 500 });
  }
}
