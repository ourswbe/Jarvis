import type { ChatMessage } from '@/lib/types';

export async function transcribeAudio(audio: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audio, 'recording.webm');

  const response = await fetch('/api/stt', { method: 'POST', body: formData });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Failed to transcribe audio');
  }

  const payload = (await response.json()) as { text: string };
  return payload.text;
}

export async function requestChatReply(messages: ChatMessage[]): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Failed to fetch assistant reply');
  }

  const payload = (await response.json()) as { reply: string };
  return payload.reply;
}

export async function synthesizeSpeech(text: string, voice?: string): Promise<Blob> {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice })
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Failed to synthesize speech');
  }

  return response.blob();
}
