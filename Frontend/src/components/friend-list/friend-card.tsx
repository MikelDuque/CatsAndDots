"use client"
import { ConnectionState, User } from "@/lib/types";
import { BASE_HTTPS_URL } from "@/features/endpoints/endpoints";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Circle, Sword } from "lucide-react";

type FriendCardProps = {
  user: User
}

export default function FriendCard({user}: FriendCardProps) {
  return (
    <div className="flex relative p-3 justify-between items-center h-15 rounded-lg hover:textShadow">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage src={`${BASE_HTTPS_URL}${user.avatar}`} alt="X"/>
          <AvatarFallback delayMs={600} className="title">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 className="subtitle">{user.username}</h2>
      </div>
      <span className=" absolute bottom-3  left-9">
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
        <Sword fill="blue"/>
      </>
    );
    case ConnectionState.Offline:
      return (
        <>
          <Circle fill="#ff444c" className="size-3"/>
        </>
      );
    case ConnectionState.Online:
      return (
        <>
          <Circle fill="green" className="size-3"/>
        </>
      );
    default:
      return (
        <>
          <p>¿?</p>
          <Circle className="size-3"/>
        </>
      );
  };
};