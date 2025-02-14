import Header from "@/components/game/game-header";
import Chat from "./chat";
import Gameplay from "./gameplay";

export default function Game() {
  return (
    <>
      <Header/>
      <main className="size-full flex bg-red-500">
        <Gameplay/>
        <Chat/>
      </main>
    </>
  );
};