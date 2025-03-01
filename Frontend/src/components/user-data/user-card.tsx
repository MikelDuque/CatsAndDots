"use client"

import { Request, User } from "@/lib/types";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { ConnectionState, RequestState } from "@/lib/enums";
import UserData from "./user-data";
import { useAuth } from "@/features/auth/auth-context";
import { useRequest } from "@/features/websocket/request-context";

type FriendCardProps = {
  user: User,
  request?: Request,
  isFriend: boolean
}

export default function UserCard({user, request, isFriend}: FriendCardProps) {
  const { decodedToken } = useAuth();
  const { sendRequest } = useRequest();

  const newRequest = {
    senderId: decodedToken?.id || 0,
    receiverId: user.id,
    state: RequestState.Pending
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="w-full"><UserData myUserId={decodedToken?.id || 0} user={user} request={request} isFriend={isFriend}/></div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Ver perfil</ContextMenuItem>
        {isFriend ?
         user.connectionState == ConnectionState.Online &&
          <ContextMenuItem onClick={() => sendRequest(newRequest, isFriend)}>
            Invitar a la partida
          </ContextMenuItem>
        :
          <ContextMenuItem onClick={() => sendRequest(newRequest, isFriend)}>
            Añadir como amigo
          </ContextMenuItem>
        }
        <ContextMenuItem>Borrar amigo</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};