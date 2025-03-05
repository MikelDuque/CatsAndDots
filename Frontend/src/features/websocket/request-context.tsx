"use client"

import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { useNotification } from "../notifications/notification-context";
import { useWebsocket } from "./websocket-context";
import { PendingFriends, Request } from "@/lib/types";
import { RequestState } from "@/lib/enums";
import useFetch from "../endpoints/useFetch";
import { GET_PENDING_FRIENDS } from "../endpoints/endpoints";
import { useAuth } from "../auth/auth-context";

/* ---- TIPADOS ---- */
type RequestContextType = {
  friendRequests: Request[]
  gameRequests: Request[]
  meInMatchmaking: boolean
  sendRequest: (request: Request, isGameRequest: boolean) => void
  setMeInMatchmaking: () => void
}

type RequestProviderProps = {
  children: ReactNode;
}

/* ----- DECLARACIÓN Context ----- */
const RequestContext = createContext<RequestContextType>({
  friendRequests: [],
  gameRequests: [],
  meInMatchmaking: false,
  sendRequest: () => {},
  setMeInMatchmaking: () => {}
});

export const useRequest = (): RequestContextType => {
  const context = useContext(RequestContext);
  if (!context) throw new Error("El contexto debe usarse dentro del provider");
  return context;
};

/* ----- CUERPO del Context ----- */
export function RequestProvider({children}: RequestProviderProps) {
  const { token, decodedToken } = useAuth();
  const { socket, messages } = useWebsocket();
  const { addNotification } = useNotification();

  const { fetchData } = useFetch({ url: GET_PENDING_FRIENDS(decodedToken?.id || 0), type: 'GET', token: token, needAuth: true, condition: !!token });

  const [friendRequests, setFriendRequests] = useState<Request[]>([]);
  const [gameRequests, setGameRequests] = useState<Request[]>([]);
  const [meInMatchmaking, setMeInMatchmaking] = useState(false);

  // Session Storage Control
  useEffect(() => {
    if(!friendRequests) {
      const sessionFR = sessionStorage.getItem("friendRequests");
      if(sessionFR) setFriendRequests(JSON.parse(sessionFR) as Request[])
    }
    else {localStorage.setItem('friendRequests', JSON.stringify(friendRequests))};

    if(!gameRequests) {
      const sessionGR = sessionStorage.getItem("gameRequests");
      if(sessionGR) setFriendRequests(JSON.parse(sessionGR) as Request[])
    }
    else localStorage.setItem('gameRequests', JSON.stringify(gameRequests));
  }, [friendRequests, gameRequests]);

  //Backend Control
  useEffect(() => {
    if(fetchData && friendRequests.length <= 0) {
      const backPendingFriends = fetchData as PendingFriends;
      setFriendRequests(backPendingFriends.receivedFriendRequests || []);
    };
  }, [fetchData]);
  
  useEffect(() => {
    const backFriendRequest = messages ? messages["FriendRequest"] as Request : undefined;
    const backMatchmakingRequest = messages ? messages["MatchmakingRequest"] as Request : undefined;
    
    if (backFriendRequest) {
      handleRequest(backFriendRequest, setFriendRequests);
      if(backFriendRequest.state === RequestState.Pending) addNotification("Has recibido una nueva petición de amistad");
    };

    if (backMatchmakingRequest) {
      handleRequest(backMatchmakingRequest, setGameRequests)
      console.log("backmatchmaking request", backMatchmakingRequest);
      
      if(backMatchmakingRequest.state === RequestState.Pending) addNotification("Alguien te ha invitado a unirse a su partida");
    };
  }, [messages]);


  //Handle Functions

  function handleRequest(request: Request, setRequests:(value: SetStateAction<Request[]>) => void) { 
    setRequests(prevState => {
      const index = existingIndex(request, prevState);
      const copy = [...prevState];

      if(index === -1) return [...copy, request];

      if(request.state === RequestState.Rejected) return copy.filter((request, i) => i !== index);

      if(copy[index].state !== RequestState.Accepted) {
        copy[index] = {
          ...copy[index],
          state: request.state
        }
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

    switch (request.state) {
      case RequestState.Pending:
        addNotification(isGameRequest ? "Invitación a partida enviada" : "Petición de amistad enviada");
        break;
      case RequestState.Accepted:
        setMeInMatchmaking(true);
        break;
    }
  };

  function handleMeInMatchmaking() {setMeInMatchmaking(prevState => !prevState);}

  /* ----- Fin Context ----- */
  const contextValue: RequestContextType = {
    friendRequests,
    gameRequests,
    meInMatchmaking,
    sendRequest,
    setMeInMatchmaking: handleMeInMatchmaking
  };

  return <RequestContext.Provider value={contextValue}>{children}</RequestContext.Provider>
};

function existingIndex(request: Request, requestList: Request[]) {
  return requestList.findIndex(thisRequest =>
    thisRequest.senderId === request.senderId &&
    thisRequest.receiverId === request.receiverId
  );
};