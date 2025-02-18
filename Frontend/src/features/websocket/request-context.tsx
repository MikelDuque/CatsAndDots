"use client";

import { FriendRequest, GenericRequest, MatchmakingRequest } from "@/lib/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useWebsocket } from "./websocket-context";
import { Action, Request } from "@/lib/enums";

/* ---- TIPADOS ---- */
type RequestContextType = {
  FriendRequests: Set<GenericRequest>
  GameRequests: Set<GenericRequest>
}

type RequestProviderProps = {
  children: ReactNode;
}

/* ----- DECLARACIÓN Context ----- */
const RequestContext = createContext<RequestContextType>({
  FriendRequests: new Set(),
  GameRequests: new Set()
});

export const useRequest = (): RequestContextType => {
  const context = useContext(RequestContext);
  if (!context) throw new Error("El contexto debe usarse dentro del provider");
  return context;
};

/* ----- CUERPO del Context ----- */
export function RequestProvider({children}: RequestProviderProps) {
  const { socket, messages } = useWebsocket();

  const [FriendRequests, setFriendRequests] = useState<Set<GenericRequest>>(new Set());
  const [GameRequests, setGameRequests] = useState<Set<GenericRequest>>(new Set());

  useEffect(() => {
    const backFriendRequest = messages ? messages["FriendRequest"] as FriendRequest : undefined;
    const backMatchmakingRequest = messages ? messages["GameInvitation"] as MatchmakingRequest : undefined; //Cambiar nombre en backend a "GameRequest"

    handleFriendRequest(backFriendRequest);
    handleGameRequest(backMatchmakingRequest);

  }, [messages]);

  function handleFriendRequest(friendRequest: FriendRequest | undefined) {
    if(!friendRequest) return;

    switch (friendRequest.requestState) {
      case Request.Pending:
        //Añadir al estado
        break;
      case Request.Accepted:
        //Mandar mensaje al websocket
        //Borrar del estado
        //(Actualizar lista amigos desde backend)
        break;
      case Request.Declined:
        //Mandar mensaje al websocket
        //Borrar del estado
        //(Actualizar lista amigos desde backend)
        break;
    };
  };

  function handleGameRequest(gameRequest: MatchmakingRequest | undefined) {
    if(!gameRequest) return;

    switch (gameRequest.action) {
      case Action.InviteFriend:
        //Añadir al estado
        break;
      case Action.AcceptInvitation:
        //Mandar mensaje al websocket
        //Borrar del estado
        break;
      case Action.RejectInvitation:
        //Mandar mensaje al websocket
        //Borrar del estado
        break;
    };
  };

  //Tomar las FriendRequest del backend en un useEffect nada más iniciar sesión
  //Receptar ambos tipos de request de los websockets y añadirlas a sus respectivas states
  //Al hacer eso último, llamar al contexto de notificaciones y crear una nueva notificación
  //Hacer la funcionalidad de aceptar/rechazar invitaciones
  //Al hacerlo, eliminarlas de los estados, así como modificarlo en el backend en el caso de las FriendRequests

  /* ----- Fin Context ----- */
  const contextValue: RequestContextType = {
    FriendRequests,
    GameRequests
  };

  return <RequestContext.Provider value={contextValue}>{children}</RequestContext.Provider>
};