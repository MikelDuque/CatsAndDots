"use client";

import { useRouter } from "next/navigation";
import { useWebsocket } from "@/features/websocket/websocket-context"; // Asegúrate de importar correctamente el contexto

type menuSectionProps = {
  onSelect: () => void
}

type MenuCardProps = {
  isHuman: boolean;
  divClass?: string;
  onClick?: () => void;
}

export default function MenuSection({onSelect}: menuSectionProps) {
  const router = useRouter();
  const { socket } = useWebsocket(); 

  const handleBotGameClick = () => {
    const message = {
      messageType: "GameBotEvent",
      body: "Iniciar partida contra el bot"
    }
    
    socket?.send(JSON.stringify(message));
    router.push("/game");
  };

  return (
    <section className="w-full flex">
      <MenuCard isHuman={false} onClick={handleBotGameClick}/>
      <MenuCard isHuman={true} onClick={onSelect}/>
    </section>
  );
};

function MenuCard({ isHuman, divClass, onClick }: MenuCardProps) {
  return (
    <div className={`flex grow-[1] items-center justify-center bg-bots_card text-invert_foreground cursor-pointer hover:grow-[2] transition-all ${isHuman ? "bg-cats_card" : "bg-bots_card"} ${divClass}`}  onClick={onClick}>
      <h1 className={`super-title hover:text-shadow-titleShadow ${isHuman && "relative after:content-['(Humanos)'] after:absolute after:left-1/2 after:-bottom-5 after:-translate-x-1/2 after:text-3xl"}`}>
        {isHuman ? "Cats" : "Bots"}
      </h1>
    </div>
  );
}
