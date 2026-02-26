'use client';

import { useMemo, useRef, useState } from 'react';
import { ChatHistory } from '@/components/ChatHistory';
import { VoiceControls } from '@/components/VoiceControls';
import { VoiceOrb } from '@/components/VoiceOrb';
import { requestChatReply, synthesizeSpeech, transcribeAudio } from '@/lib/apiClient';
import { JARVIS_SYSTEM_PROMPT } from '@/lib/prompts';
import { startRecording, type RecorderController } from '@/lib/recorder';
import type { ChatMessage, VoiceState } from '@/lib/types';

const MAX_MESSAGES = 20;

const statusText: Record<VoiceState, string> = {
  idle: 'Idle',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
  error: 'Error'
};

function getErrorHint(error: string | null): string | null {
  if (!error) return null;

  if (error.includes('No microphone device found')) {
    return 'Tip: connect a headset or enable a microphone input in OS sound settings.';
  }

  if (error.includes('Microphone access denied')) {
    return 'Tip: click the lock icon near the address bar and allow microphone for this site.';
  }

  if (error.includes('Missing API key')) {
    return 'Tip: add OPENAI_API_KEY in .env.local and restart npm run dev.';
  }

  return null;
}

export default function VoicePage() {
  const [state, setState] = useState<VoiceState>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'system', content: JARVIS_SYSTEM_PROMPT }]);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<RecorderController | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const lastText = useMemo(() => {
    const last = [...messages].reverse().find((message) => message.role !== 'system');
    return last?.content || 'Tap Start and speak to Jarvis';
  }, [messages]);

  const errorHint = useMemo(() => getErrorHint(error), [error]);

  const pushMessage = (message: ChatMessage) => {
    setMessages((prev) => {
      const next = [...prev, message];
      const system = next.filter((item) => item.role === 'system');
      const nonSystem = next.filter((item) => item.role !== 'system').slice(-MAX_MESSAGES);
      return [...system, ...nonSystem];
    });
  };

  const stopAudioPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  };

  const handleStart = async () => {
    try {
      setError(null);
      stopAudioPlayback();
      const recorder = await startRecording();
      recorderRef.current = recorder;
      setState('listening');
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Unable to access microphone');
    }
  };

  const handleStop = async () => {
    if (!recorderRef.current) return;

    try {
      setError(null);
      setState('thinking');

      const blob = await recorderRef.current.stop();
      recorderRef.current = null;

      const userText = (await transcribeAudio(blob)).trim();
      if (!userText) {
        throw new Error('No speech detected, please try again');
      }

      const userMessage: ChatMessage = { role: 'user', content: userText };
      pushMessage(userMessage);

      const history = [...messages, userMessage].slice(-(MAX_MESSAGES + 1));
      const reply = await requestChatReply(history);
      const assistantMessage: ChatMessage = { role: 'assistant', content: reply };
      pushMessage(assistantMessage);

      if (muted) {
        setState('idle');
        return;
      }

      const audioBlob = await synthesizeSpeech(reply);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setState('speaking');

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        setState('idle');
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        setState('error');
        setError('Unable to play synthesized audio');
      };

      await audio.play();
    } catch (err) {
      recorderRef.current = null;
      setState('error');
      setError(err instanceof Error ? err.message : 'Unexpected error during voice workflow');
    }
  };

  const handleClear = () => {
    stopAudioPlayback();
    setMessages([{ role: 'system', content: JARVIS_SYSTEM_PROMPT }]);
    setError(null);
    setState('idle');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-5 py-8 text-slate-100">
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col gap-7">
        <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
          <h1 className="text-lg font-semibold">Jarvis</h1>
          <p className="text-sm text-slate-300">{statusText[state]}</p>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center gap-7 rounded-3xl border border-white/10 bg-slate-900/55 p-8 text-center">
          <VoiceOrb state={state} />
          <p className="max-w-2xl text-xl leading-relaxed text-slate-100">{lastText}</p>
          <VoiceControls
            state={state}
            muted={muted}
            onStart={handleStart}
            onStop={handleStop}
            onToggleMute={() => setMuted((value) => !value)}
            onClear={handleClear}
          />
          <div className="space-y-1">
            <p className={`text-sm ${error ? 'text-rose-300' : 'text-slate-400'}`}>
              {error || 'Microphone and network status are healthy.'}
            </p>
            {errorHint && <p className="text-xs text-amber-300">{errorHint}</p>}
          </div>
        </section>

        <ChatHistory messages={messages} />
      </div>
    </main>
  );
}
