import type { VoiceState } from '@/lib/types';

type VoiceControlsProps = {
  state: VoiceState;
  muted: boolean;
  onStart: () => void;
  onStop: () => void;
  onToggleMute: () => void;
  onClear: () => void;
};

function buttonStyles(enabled: boolean): string {
  return `rounded-full px-5 py-2 text-sm font-medium transition ${
    enabled ? 'bg-slate-200 text-slate-900 hover:bg-white' : 'cursor-not-allowed bg-slate-700 text-slate-400'
  }`;
}

export function VoiceControls({ state, muted, onStart, onStop, onToggleMute, onClear }: VoiceControlsProps) {
  const canStart = state === 'idle' || state === 'error';
  const canStop = state === 'listening';

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button type="button" className={buttonStyles(canStart)} onClick={onStart} disabled={!canStart}>
        Start
      </button>
      <button type="button" className={buttonStyles(canStop)} onClick={onStop} disabled={!canStop}>
        Stop
      </button>
      <button type="button" className={buttonStyles(true)} onClick={onToggleMute}>
        {muted ? 'Unmute' : 'Mute'}
      </button>
      <button type="button" className={buttonStyles(true)} onClick={onClear}>
        Clear
      </button>
    </div>
  );
}
