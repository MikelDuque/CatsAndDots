"use client"
import { ConnectionState, User } from "@/lib/types";
import { BASE_HTTPS_URL } from "@/features/endpoints/endpoints";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Circle, Sword } from "lucide-react";
import Title from "../utils/title";

type FriendCardProps = {
  user: User
}

export default function FriendCard({user}: FriendCardProps) {
  return (
    <div className="flex p-3 justify-between items-center h-15 rounded-lg hover:shadow-md hover:shadow-current">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage src={`${BASE_HTTPS_URL}${user.avatar}`} alt="X"/>
          <AvatarFallback delayMs={600} className="title">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 className="subtitle">{user.username}</h2>
      </div>
      <span className="flex gap-1 items-center text-xs">
        {SetConnectionState(user)}
      </span>
    </div>
  );
}

function SetConnectionState(user: User) {
  switch (user.connectionState) {
    case ConnectionState.Playing:
    return (
      <>
        <p>Jugando</p>
        <Sword fill="blue"/>
      </>
    );
    case ConnectionState.Offline:
      return (
        <>
          <p>Desc.</p>
          <Circle fill="#ff444c" className="size-5"/>
        </>
      );
    case ConnectionState.Online:
      return (
        <>
          <p>Conectado</p>
          <Circle fill="green" className="size-5"/>
        </>
      );
    default:
      return (
        <>
          <p>¿?</p>
          <Circle className="size-5"/>
        </>
      );
  };
};