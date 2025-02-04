"use client";

import { useEffect, useState } from "react";
import { useWebsocket } from "@/features/websocket/websocket-context";
import { Button } from "../ui/button";
import { ConnectionState, User } from "@/lib/types";
import { Input } from "../ui/input";
import { ChevronLeft, ChevronRight, Circle, Heading1, Search, Sword, UserPlus, Users } from "lucide-react";
import Title from "../utils/title";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@radix-ui/react-context-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { BASE_HTTPS_URL, GET_FRIENDLIST } from "@/features/endpoints/endpoints";
import useFetch from "@/features/endpoints/useFetch";
import { useAuth } from "@/features/auth/auth-context";

export default function FriendList() {
  const {messages} = useWebsocket();
  const {token, decodedToken} = useAuth();

  const {fetchData} = useFetch({url: GET_FRIENDLIST(decodedToken?.id || 0), type: "GET", token: token, needAuth: true});

  const [hideFriends, setHideFriendlist] = useState(false);
  const [friendList, setFriendlist] = useState<Array<User>>([]);

  useEffect(() => {
    if(fetchData) setFriendlist(fetchData);
  }, [fetchData]);
    
  useEffect(() => { 
    //TERMINAR
  }, [messages]);

  /*
  useEffect(() => {
    if(message?.MessageType === "FriendList" && Array.isArray(message?.Body)) setFriendlist(message?.Body);
  }, [message]);
  */

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
          {ListMapper(friendList)}
        </ul>
      </aside>
    </>
  );
};

function ListMapper(list: Array<User>) {
  return (list.length > 0 ? (
    list.map((user) => (
      <li key={user.id}>
        <ContextMenu>
          <ContextMenuTrigger className="flex">
            <Avatar className="h-full aspect-square items-center justify-center overflow-hidden rounded-full cursor-pointer">
              <AvatarImage src={`${BASE_HTTPS_URL}${user.avatar}`} alt="X" className="size-full object-scale-down"/>
              <AvatarFallback delayMs={600} className="title">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Heading1/>{user.username}
            {SetConnectionState(user)}
          </ContextMenuTrigger>
          <ContextMenuContent>

          </ContextMenuContent>
        </ContextMenu>
      </li>
  ))) : <p className="body-text">No se ha podido cargar tus amigos</p>);
};

function SetConnectionState(user: User) {
  return user.connectionState === ConnectionState.Playing ? <Sword color="green"/> : <Circle color={SetColor()}/>

  function SetColor() {
    switch (user.connectionState) {
      case ConnectionState.Online:
        return "green";
      case ConnectionState.Offline:
        return "red";
      default:
        return "";
    };
  };
};