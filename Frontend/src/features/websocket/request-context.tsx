"use client";

import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { useNotification } from "../notification-context";
import { useWebsocket } from "./websocket-context";
import { Request } from "@/lib/types";
import { RequestState } from "@/lib/enums";

/* ---- TIPADOS ---- */
type RequestContextType = {
  friendRequests: Request[];
  gameRequests: Request[];
  sendRequest: (request: Request, isGameRequest: boolean) => void
}

type RequestProviderProps = {
  children: ReactNode;
}

/* ----- DECLARACIÓN Context ----- */
const RequestContext = createContext<RequestContextType>({
  friendRequests: [],
  gameRequests: [],
  sendRequest: () => {}
});

export const useRequest = (): RequestContextType => {
  const context = useContext(RequestContext);
  if (!context) throw new Error("El contexto debe usarse dentro del provider");
  return context;
};

/* ----- CUERPO del Context ----- */
export function RequestProvider({children}: RequestProviderProps) {
  const { socket, messages } = useWebsocket();
  const { addNotification } = useNotification();

  const [friendRequests, setFriendRequests] = useState<Request[]>(getFromSession("friendRequests"));
  const [gameRequests, setGameRequests] = useState<Request[]>(getFromSession("gameRequests"));

  useEffect(() => {
    const backFriendRequest = messages ? messages["FriendRequest"] as Request : undefined;
    const backMatchmakingRequest = messages ? messages["GameInvitation"] as Request : undefined;

    if (backFriendRequest) {
      handleRequest(backFriendRequest, setFriendRequests)
      addNotification("Has recibido una nueva petición de amistad");
    };

    if (backMatchmakingRequest) {
      handleRequest(backMatchmakingRequest, setGameRequests)
      addNotification("Alguien te ha invitado a unirse a su partida");
    };

  }, [messages]);

  useEffect(() => {
    if (friendRequests) {
      localStorage.setItem('friendRequests', JSON.stringify(friendRequests));
    };

    if (gameRequests) {
      localStorage.setItem('gameRequests', JSON.stringify(gameRequests));
    };
    
  }, [friendRequests, gameRequests]);

  
  
  function handleRequest(request: Request, setRequests: (value: SetStateAction<Request[]>) => void) {
    
    setRequests(prevState => {
      const index = existingIndex(request, prevState);
      const copy = [...prevState];

      if(index === -1) return [...copy, request];

      if(request.state === RequestState.Rejected) return copy.filter((request, i) => i !== index);

      copy[index] = {
        ...copy[index],
        state: request.state
      }
      return copy;
    });
  };

  function sendRequest(request: Request, isGameRequest: boolean) {
    const message = {
      messageType: isGameRequest ? "MatchmakingRequest" : "FriendRequest",
      body: request
    }
    socket?.send(JSON.stringify(message));

    handleRequest(request, isGameRequest ? setGameRequests : setFriendRequests);

    if (request.state !== RequestState.Pending) {
      const notiMessage = isGameRequest ? "Invitación a partida enviada" : "Petición de amistad enviada";
      addNotification(notiMessage);
    }
  };

  /* ----- Fin Context ----- */
  const contextValue: RequestContextType = {
    friendRequests,
    gameRequests,
    sendRequest
  };

  return <RequestContext.Provider value={contextValue}>{children}</RequestContext.Provider>
};

function existingIndex(request: Request, requestList: Request[]) {
  return requestList.findIndex(thisRequest =>
    thisRequest.senderId === request.senderId &&
    thisRequest.receiverId === request.senderId
  );
};

function getFromSession(key: string) {
  const value = sessionStorage.getItem(key);

  return value ? JSON.parse(value) : [];
}