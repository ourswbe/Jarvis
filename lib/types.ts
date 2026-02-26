export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};
