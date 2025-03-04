"use client";

import { useRouter } from "next/navigation";
import { useWebsocket } from "@/features/websocket/websocket-context"; // Asegúrate de importar correctamente el contexto

export default function MenuSection({ onSelectCats }: { onSelectCats: () => void }) {
  const router = useRouter();
  const { sendMessage } = useWebsocket(); 

  const handleBotGameClick = () => {
    sendMessage({ MessageType: "GameBotEvent", Body: "Iniciar partida contra el bot" });
    router.push("/game");
  };

  return (
    <section className="w-full flex">
      <MenuCard isHuman={false} onClick={handleBotGameClick} />
      <MenuCard isHuman={true} onClick={onSelectCats} />
    </section>
  );
}

type MenuCardProps = {
  isHuman: boolean;
  divClass?: string;
  onClick?: () => void;
};

function MenuCard({ isHuman, divClass, onClick }: MenuCardProps) {
  return (
    <div
      className={`flex grow-[1] items-center justify-center cursor-pointer hover:grow-[2] transition-all ${isHuman ? "bg-cats_card" : "bg-bots_card"} ${divClass}`}
      onClick={onClick}
    >
      <h1
        className={`super-title hover:text-shadow-titleShadow ${
          isHuman &&
          "relative after:content-['(Humanos)'] after:absolute after:left-1/2 after:-bottom-5 after:-translate-x-1/2 after:text-3xl"
        }`}
      >
        {isHuman ? "Cats" : "Bots"}
      </h1>
    </div>
  );
}
