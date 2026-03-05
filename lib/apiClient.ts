import type { ChatMessage } from '@/lib/types';

function fileExtensionFromMime(mimeType: string): string {
  if (mimeType.includes('mp4')) return 'm4a';
  if (mimeType.includes('mpeg')) return 'mp3';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('wav')) return 'wav';
  return 'webm';
}

export async function transcribeAudio(audio: Blob): Promise<string> {
  const formData = new FormData();
  const extension = fileExtensionFromMime(audio.type || '');
  const filename = `recording.${extension}`;
  formData.append('audio', audio, filename);

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
