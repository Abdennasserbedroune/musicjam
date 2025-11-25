import Link from 'next/link';
import CreateRoomButton from '@/components/CreateRoomButton';
import JoinRoomForm from '@/components/JoinRoomForm';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">🎵 MusicJam</h1>
          <p className="mt-4 text-lg text-primary-100">
            Create and share collaborative YouTube playlists
          </p>
        </div>

        <div className="space-y-4 rounded-lg bg-white p-8 shadow-xl">
          <CreateRoomButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">
                or join a room
              </span>
            </div>
          </div>

          <JoinRoomForm />
        </div>

        <p className="text-center text-sm text-primary-100">
          No signup required. Just create a room and start jamming!
        </p>
      </div>
    </div>
  );
}
