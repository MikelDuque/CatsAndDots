"use client"

import { useEffect, useState } from "react";
import { useWebsocket } from "@/features/websocket/websocket-context";
//UTILS
import { ConnectionState, User } from "@/lib/types";
import { GET_FRIENDLIST } from "@/features/endpoints/endpoints";
import useFetch from "@/features/endpoints/useFetch";
import { useAuth } from "@/features/auth/auth-context";
//COMPONENTS
import Title from "../utils/title";
import UserSearch from "./user-search";
import FriendCard from "./friend-card";
//SHADCN
import { Button } from "../ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
//LUCIDE
import { ChevronLeft, ChevronRight, Search, UserPlus, Users } from "lucide-react";



export default function FriendList() {
  const {messages} = useWebsocket();
  const {token, decodedToken} = useAuth();

  const {fetchData} = useFetch({url: GET_FRIENDLIST(decodedToken?.id || 0), type: "GET", token: token, needAuth: true, condition: !!token});

  const [hideFriends, setHideFriendlist] = useState(false);
  const [friendList, setFriendlist] = useState<Array<User>>([]);

  useEffect(() => {
    if(fetchData) setFriendlist(fetchData as Array<User>);
  }, [fetchData]);
    
  useEffect(() => { 
    const user = messages ? messages["UserData"] as User : undefined; 
    setFriendlist(previousState => previousState.map(friend => {console.log("user", user); console.log("friend", friend);
    
     return friend.id === user?.id ? user : friend}));
    
  }, [messages]);

  function OnHide() {setHideFriendlist(previousState => !previousState)};

  return (
    <>
      {hideFriends && 
        <Button variant="ghost" onClick={OnHide} className={`absolute right-0 ${hideFriends ? "" : "hidden"}`}>
          <ChevronLeft/><Users/>
        </Button >
      }
      <aside className={`p-2 flex flex-col w-2/6 h-full bg-secondary gap-5 ${hideFriends && "fixed right-full"}`}>
        <div className="flex justify-between">
          <Button variant="ghost" size="icon" onClick={OnHide}><ChevronRight/></Button >
          <Title moreClasses="w-full">Amigos</Title>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon"><UserPlus/></Button>
            </DialogTrigger>
            <DialogContent className="bg-popover">
              <DialogHeader>
                <DialogTitle><Title>Búsqueda de Usuarios</Title></DialogTitle>
              </DialogHeader>
              <UserSearch/>
            </DialogContent>
          </Dialog>
        </div>
        
        <form className="flex w-full gap-1">
          <Input
            name="friendSearch"
            type="text"
            placeholder="Buscar amigos"
          />
          <Button type="submit" size="icon" variant="ghost"><Search/></Button>
        </form>

        <ul className="text-body grid gap-1">
          {ListMapper(friendList)}
        </ul>
      </aside>
    </>
  );
};

function ListMapper(list: Array<User>) {
  return (list.length > 0 ? (
    list.map((user) => (
      <li key={user.id} className="cursor-pointer">
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div><FriendCard user={user}/></div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Ver perfil</ContextMenuItem>
            {user.connectionState !== ConnectionState.Playing && 
              <ContextMenuItem>Invitar a la partida</ContextMenuItem>
            }
            <ContextMenuItem>Borrar amigo</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </li>
  ))) : <p className="body-text">No se ha podido cargar tus amigos</p>);
};

