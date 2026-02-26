import type { VoiceState } from '@/lib/types';

type VoiceOrbProps = {
  state: VoiceState;
};

const stateStyles: Record<VoiceState, string> = {
  idle: 'from-cyan-400 via-blue-500 to-indigo-500 animate-orb-breathe',
  listening: 'from-emerald-400 via-cyan-500 to-blue-600 animate-orb-pulse',
  thinking: 'from-fuchsia-400 via-violet-500 to-blue-600 animate-orb-think',
  speaking: 'from-cyan-300 via-sky-400 to-indigo-500 animate-orb-pulse-fast',
  error: 'from-orange-400 via-rose-500 to-red-600 animate-orb-pulse'
};

export function VoiceOrb({ state }: VoiceOrbProps) {
  return (
    <div className="relative h-40 w-40 sm:h-44 sm:w-44">
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${stateStyles[state]} shadow-[0_0_70px_rgba(56,189,248,0.45)]`} />
      <div className="absolute inset-3 rounded-full border border-white/20 bg-slate-900/35 backdrop-blur-sm" />
    </div>
  );
}
