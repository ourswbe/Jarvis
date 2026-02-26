import type { ChatMessage } from '@/lib/types';

type ChatHistoryProps = {
  messages: ChatMessage[];
};

export function ChatHistory({ messages }: ChatHistoryProps) {
  const visible = messages.filter((m) => m.role !== 'system');

  return (
    <div className="h-56 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <div className="space-y-3">
        {visible.length === 0 && <p className="text-sm text-slate-400">No messages yet.</p>}
        {visible.map((message, index) => (
          <div key={`${message.role}-${index}`} className="text-sm">
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">{message.role === 'user' ? 'You' : 'Jarvis'}</p>
            <p className="rounded-xl bg-white/5 p-2.5 text-slate-100">{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
