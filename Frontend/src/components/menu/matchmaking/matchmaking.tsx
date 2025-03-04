"use client"

import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { ChevronLeft } from "lucide-react";
import { User } from "@/lib/types";
import { RequestState } from "@/lib/enums";
import { useRequest } from "@/features/websocket/request-context";
import { useAuth } from "@/features/auth/auth-context";
import { useWebsocket } from "@/features/websocket/websocket-context";
import PlayerCard from "./player-card";

type matchmakingProps = {
  onBack: () => void
}

type Players = {
  Host?: User
  Guest?: User
};

export default function Matchmaking({ onBack }: matchmakingProps) {
  const { decodedToken } = useAuth();
  const { gameRequests, sendRequest } = useRequest();
  const { messages } = useWebsocket();

  const me = {
    id: decodedToken?.id || 0,
    username: decodedToken?.unique_name || "",
    avatar: decodedToken?.avatar || ""
  };

  const [players, setPlayers] = useState<Players>({});

  const meGuest = gameRequests.some(request => request.receiverId === decodedToken?.id && request.state === RequestState.Accepted);
  const meHost = gameRequests.some(request => request.senderId === decodedToken?.id && request.state === RequestState.Accepted);

  useEffect(() => {
    if(messages && (meGuest || meHost)) {
      const userData = messages["UserData"] as User;

    if(meGuest) setPlayers({Host: userData, Guest: me})
    else setPlayers({Host: me, Guest: userData});
    }
    else setPlayers({Host: me, Guest: undefined});
    
  }, [messages, gameRequests]);

  function onExist() {
    console.log("holaaaaaa");
    
    console.log("se cumple?", players.Host && players.Guest);
    
    if (players.Host && players.Guest) {
      const cancelRequest = {
        senderId: players.Host.id,
        receiverId: players.Guest.id,
        state: RequestState.Rejected
      }

      sendRequest(cancelRequest, true);
    };
    //onBack();
  };

  return (
    <section className="w-full relative flex justify-around items-center">
      <Button variant="ghost" size="icon" className="absolute left-4 top-4" onClick={onExist}>
        <ChevronLeft />
      </Button>
      <PlayerCard player={players?.Host} isHost={true}/>
      <span className="super-title text-primary">VS</span>
      <PlayerCard player={players?.Guest} isHost={false}/>
      <Button className="absolute bottom-20">Empezar Partida</Button>
    </section>
  );
};