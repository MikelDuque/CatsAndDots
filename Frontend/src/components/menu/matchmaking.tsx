import Title from "../utils/title";

export default function Matchmaking({ onBack }: { onBack: () => void }) {
  return (
    <main className="flex flex-col items-center w-screen h-screen p-6 relative">
      <button
        onClick={onBack}
        className="absolute top-4 right-4 px-6 py-3 bg-red-500 text-white rounded-xl text-lg font-semibold hover:bg-red-600 transition shadow-md"
      >
        Volver al menú
      </button>
      <Title moreClasses="absolute top-8">Matchmaking</Title>
      <div className="flex w-full px-32 mt-40 justify-between">
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 bg-gray-700 text-white flex items-center justify-center rounded-full text-lg font-bold">
            Foto
          </div>
          <span className="text-xl font-semibold">Jugador 1</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 bg-gray-700 text-white flex items-center justify-center rounded-full text-lg font-bold">
            Foto
          </div>
          <span className="text-xl font-semibold">Jugador 2</span>
        </div>
      </div>
    </main>
  );
}
