import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-5xl font-semibold tracking-tight">Jarvis</h1>
        <p className="text-slate-300">Voice AI chat mode with speech recognition, chat responses and text-to-speech.</p>
        <Link
          href="/voice"
          className="inline-flex rounded-full bg-cyan-500 px-6 py-3 font-medium text-slate-900 transition hover:bg-cyan-400"
        >
          Start Jarvis
        </Link>
      </div>
    </main>
  );
}
