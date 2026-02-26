import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/serverOpenai';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing audio file' }, { status: 400 });
    }

    const client = getOpenAIClient();
    const model = process.env.OPENAI_STT_MODEL || 'whisper-1';

    const transcription = await client.audio.transcriptions.create({
      file,
      model
    });

    return NextResponse.json({ text: transcription.text || '' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'STT service error';
    if (message === 'Missing API key') {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}
