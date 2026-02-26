import { NextResponse } from 'next/server';
import { JARVIS_SYSTEM_PROMPT } from '@/lib/prompts';
import { getOpenAIClient } from '@/lib/serverOpenai';
import type { ChatMessage } from '@/lib/types';

type ChatRequestPayload = {
  messages?: ChatMessage[];
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ChatRequestPayload;
    const messages = payload.messages || [];

    if (messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const client = getOpenAIClient();
    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: JARVIS_SYSTEM_PROMPT },
        ...messages.filter((message) => message.role !== 'system').map((message) => ({
          role: message.role,
          content: message.content
        }))
      ]
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    return NextResponse.json({ reply: reply || 'I am ready to help.' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'LLM service error';
    if (message === 'Missing API key') {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to generate assistant reply' }, { status: 500 });
  }
}
