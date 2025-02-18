"use client"
import { User } from "@/lib/types";
import { BASE_HTTPS_URL } from "@/features/endpoints/endpoints";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Circle, Sword } from "lucide-react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { Button } from "../ui/button";
import { ConnectionState } from "@/lib/enums";

type FriendCardProps = {
  user: User
}

export default function FriendCard({user}: FriendCardProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {UserData(user)}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Ver perfil</ContextMenuItem>
        {user.connectionState !== ConnectionState.Playing &&
          <ContextMenuItem>Invitar a la partida</ContextMenuItem>
        }
        <ContextMenuItem>Borrar amigo</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function UserData(user: User) {
  return (
    <div className="w-full h-15 p-3 flex justify-between items-center gap-5 rounded-lg hover:shadow-md hover:shadow-current">
      <div className="flex gap-5 items-center">
        <figure className="relative">
          <Avatar>
            <AvatarImage src={`${BASE_HTTPS_URL}${user.avatar}`} alt="X"/>
            <AvatarFallback delayMs={500} className="title">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <figure className="absolute size-5 -bottom-1.5 -right-1.5">{SetConnectionState(user)}</figure>
        </figure>

        <h2 className="subtitle">{user.username}</h2>
      </div>

      <div className="flex gap-1">
        <Button size="sm">✔</Button>
        <Button size="sm">✖</Button>
      </div>
    </div>
  );
};

function SetConnectionState(user: User) {
  switch (user.connectionState) {
    case ConnectionState.Offline:
      return <Circle fill="#ff444c" size="fill"/>

    case ConnectionState.Online:
      return <Circle fill="green" size="fill"/>

    case ConnectionState.Playing:
      return <Sword fill="blue" size="fill"/>

    default:
      return <Circle/>
  };
};