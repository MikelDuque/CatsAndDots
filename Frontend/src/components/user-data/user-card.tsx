"use client"

import { Request, User } from "@/lib/types";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { ConnectionState, RequestState } from "@/lib/enums";
import UserData from "./user-data";
import { useAuth } from "@/features/auth/auth-context";
import { useRequest } from "@/features/websocket/request-context";

type FriendCardProps = {
  user: User,
  request: Request,
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

  const requestMessage = isFriend ? "Invitar a la partida" : "Añadir como amigo"

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <UserData myUserId={decodedToken?.id || 0} user={user} request={request} isFriend={isFriend}/>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Ver perfil</ContextMenuItem>
        {user.connectionState == ConnectionState.Online &&
          <ContextMenuItem onClick={() => sendRequest(newRequest, isFriend)}>
            {requestMessage}
          </ContextMenuItem>
        }
        <ContextMenuItem>Borrar amigo</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}