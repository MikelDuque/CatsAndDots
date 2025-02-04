"use client";

import { useEffect, useState } from "react";
import { useWebsocketContext } from "@/features/websocket/contextApi";
import { Button } from "../ui/button";
import { ConnectionState, User } from "@/lib/types";
import { Input } from "../ui/input";
import { ChevronLeft, ChevronRight, Circle, Heading1, Search, Sword, UserPlus, Users } from "lucide-react";
import Title from "../utils/title";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@radix-ui/react-context-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { BASE_HTTPS_URL } from "@/lib/endpoints";

export default function FriendList() {
const {message} = useWebsocketContext();
  const [hideFriends, setHideFriendlist] = useState(false);
  const [friendList, setFriendlist] = useState<Array<User>>();

  useEffect(() => {
    if(message?.MessageType === "FriendList" && Array.isArray(message?.Body)) setFriendlist(message?.Body);
  }, [message]);

  function onHide() {setHideFriendlist((previousState) => !previousState)};

  return (
    <>
      <div className={`p-2 flex items-center gap-1 absolute right-0 ${hideFriends ? "" : "hidden"}`}>
        <Button variant="ghost" size="icon" onClick={onHide}><ChevronLeft/></Button >
        <Users/>
      </div>
      <aside className={`z-10 fixed flex flex-col w-1/4 h-full bg-secondary p-2 gap-5 ${hideFriends ? "right-full" : "right-0"}`}>
        <div className="flex justify-between">
          <Button variant="ghost" size="icon" onClick={onHide}><ChevronRight/></Button >
          <Title moreClasses="w-full">Amigos</Title>
          <Button variant="ghost" size="icon"><UserPlus/></Button>
        </div>
        
        <form className="flex w-full gap-1">
          <Input
            name="friendSearch"
            type="text"
            placeholder="Buscar amigos"
          />
          <Button type="submit" size="icon" variant="ghost"><Search/></Button>
        </form>
        <ul className="text-body">
          {ListMapper(friendList || [])}
        </ul>
      </aside>
    </>
  );
};

function ListMapper(list: Array<User>) {
  return (list.length > 0 ? (
    list.map((user) => (
      <li key={user.Id}>
        <ContextMenu>
          <ContextMenuTrigger className="flex">
            <Avatar className="h-full aspect-square items-center justify-center overflow-hidden rounded-full cursor-pointer">
              <AvatarImage src={`${BASE_HTTPS_URL}${user.Avatar}`} alt="X" className="size-full object-scale-down"/>
              <AvatarFallback delayMs={600} className="title">{user.Username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Heading1/>{user.Username}
            {SetConnectionState(user)}
          </ContextMenuTrigger>
          <ContextMenuContent>

          </ContextMenuContent>
        </ContextMenu>
      </li>
  ))) : <p className="body-text">No se ha podido cargar tus amigos</p>);
};

function SetConnectionState(user: User) {
  return user.ConnectionState === ConnectionState.Playing ? <Sword color="green"/> : <Circle color={SetColor()}/>

  function SetColor() {
    switch (user.ConnectionState) {
      case ConnectionState.Online:
        return "green";
      case ConnectionState.Offline:
        return "red";
      default:
        return "";
    };
  };
};