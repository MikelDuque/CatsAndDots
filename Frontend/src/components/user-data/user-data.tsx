"use client"

import { BASE_HTTPS_URL } from "@/features/endpoints/endpoints";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import RequestInteraction from "./request-interaction";
import { ConnectionState, ListType } from "@/lib/enums";
import { Circle, Sword } from "lucide-react";

type userDataProps = {
  user: User,
  listType: ListType,
  myUserId: number
}

export default function UserData({ user, listType, myUserId}: userDataProps) {


  return (
    <div className="w-full h-15 p-3 flex justify-between items-center gap-5 rounded-lg hover:shadow-md hover:shadow-current">
      <div className="flex gap-5 items-center">
        <figure className="relative">
          <Avatar>
            <AvatarImage src={`${BASE_HTTPS_URL}${user.avatar}`}/>
            <AvatarFallback delayMs={500} className="title">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <figure className="absolute size-5 -bottom-1.5 -right-1.5">{SetConnectionState(user)}</figure>
        </figure>
        <h2 className="subtitle">{user.username}</h2>
      </div>
      <RequestInteraction user={user} listType={listType} myUserId={myUserId}/>
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