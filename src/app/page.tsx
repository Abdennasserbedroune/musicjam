export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
          musicjam
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Synchronized YouTube listening with friends
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-neon-purple hover:bg-purple-700 text-white rounded-lg font-semibold transition-all hover:scale-105">
            Create Room
          </button>
          <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all hover:scale-105">
            Join Room
          </button>
        </div>
      </div>
    </main>
  );
}
