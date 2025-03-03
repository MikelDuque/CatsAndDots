"use client"

import { User } from "@/lib/types";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { ConnectionState, ListType, RequestState } from "@/lib/enums";
import UserData from "./user-data";
import { useAuth } from "@/features/auth/auth-context";
import { useRequest } from "@/features/websocket/request-context";
import { useRouter } from "next/navigation";
import { profilePath } from "@/lib/paths";

type FriendCardProps = {
  user: User,
  listType: ListType,
  onUserSelect?: () => void
}

export default function UserCard({user, listType, onUserSelect}: FriendCardProps) {
  const router = useRouter();
  const { decodedToken } = useAuth();
  const { meInMatchmaking, sendRequest } = useRequest();

  const isFriend = [ListType.friends, ListType.matchmaking].includes(listType);

  const isEnable = isFriend && meInMatchmaking && user.connectionState === ConnectionState.Online;

  const newRequest = {
    senderId: decodedToken?.id || 0,
    receiverId: user.id,
    state: RequestState.Pending
  }

  function handleClick() {
    if(listType === ListType.matchmaking) sendRequest(newRequest, true)
    else router.push(profilePath(user.id))

    onUserSelect!();
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <li key={user.id} className="w-full cursor-pointer flex items-center gap-20" onClick={handleClick}>
          <UserData user={user} listType={listType} myUserId={decodedToken?.id || 0}/>
        </li>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Ver perfil</ContextMenuItem>
        <ContextMenuItem onClick={() => sendRequest(newRequest, isFriend)} disabled={!isEnable}>
          {isFriend ? "Invitar a la partida": "Añadir como amigo"}
        </ContextMenuItem>
        <ContextMenuItem>Borrar amigo</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};