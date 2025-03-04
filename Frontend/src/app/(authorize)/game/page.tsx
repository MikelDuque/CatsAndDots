import Header from "@/components/game/game-header";
import Chat from "../../../components/game/chat";
import Gameplay from "../../../components/game/gameplay";

export default function Game() {
  return (
    <>
      <Header/>
      <main className="size-full flex ">
        <Gameplay/>
        <Chat/>
      </main>
    </>
  );
};