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
  const { messages, sendMessage } = useWebsocket();
  const { token, decodedToken } = useAuth();

  const { fetchData } = useFetch({ url: GET_FRIENDLIST(decodedToken?.id || 0), type: "GET", token: token, needAuth: true, condition: !!token });

  const [hideFriends, setHideFriendlist] = useState(false);
  const [friendList, setFriendlist] = useState<Array<User>>([]);
  const [pendingInvitations, setPendingInvitations] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (fetchData) setFriendlist(fetchData as Array<User>);
  }, [fetchData]);

  useEffect(() => {
    const user = messages ? messages["UserData"] as User : undefined;
    setFriendlist(previousState => previousState.map(friend => {

      return friend.id === user?.id ? user : friend
    }));

  }, [messages]);

  useEffect(() => {
    if (!messages || typeof messages !== "object") return; 
    const invitationMessage = (messages as Record<string, any>)["GameInvitation"];
  
    if (invitationMessage && typeof invitationMessage === "object") {
      const senderId = invitationMessage["senderId"];
      const recipientId = decodedToken?.id;
  
      if (typeof senderId === "number" && recipientId !== senderId) {
        setPendingInvitations(prev => ({
          ...prev,
          [senderId]: true 
        }));
      }
    }
  
  }, [messages]);


  function acceptInvitation(hostId: number) {
    sendMessage({
      MessageType: "MatchmakingMessage",
      Body: {
        Action: "AcceptInvitation",
        HostId: hostId,
        GuestId: decodedToken?.id
      }
    });

    setPendingInvitations(prev => {
      const updatedInvitations = { ...prev };
      delete updatedInvitations[hostId];
      return  { ...updatedInvitations };
    });
  }

  function rejectInvitation(hostId: number) {
    sendMessage({
      MessageType: "MatchmakingMessage",
      Body: {
        Action: "RejectInvitation",
        HostId: hostId,
        GuestId: decodedToken?.id
      }
    });

    setPendingInvitations(prev => {
      const updatedInvitations = { ...prev };
      delete updatedInvitations[hostId]; 
      return updatedInvitations;
    });
  }


  function OnHide() { setHideFriendlist(previousState => !previousState) };

  return (
    <>
      {hideFriends &&
        <Button variant="ghost" onClick={OnHide} className={`absolute right-0 ${hideFriends ? "" : "hidden"}`}>
          <ChevronLeft /><Users />
        </Button >
      }
      <aside className={`p-2 flex flex-col w-2/6 h-full bg-secondary gap-5 ${hideFriends && "fixed right-full"}`}>
        <div className="flex justify-between">
          <Button variant="ghost" size="icon" onClick={OnHide}><ChevronRight /></Button >
          <Title moreClasses="w-full">Amigos</Title>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon"><UserPlus /></Button>
            </DialogTrigger>
            <DialogContent className="bg-popover">
              <DialogHeader>
                <DialogTitle><Title>Búsqueda de Usuarios</Title></DialogTitle>
              </DialogHeader>
              <UserSearch />
            </DialogContent>
          </Dialog>
        </div>

        <form className="flex w-full gap-1">
          <Input
            name="friendSearch"
            type="text"
            placeholder="Buscar amigos"
          />
          <Button type="submit" size="icon" variant="ghost"><Search /></Button>
        </form>

        <ul className="text-body grid gap-1">
          {ListMapper(friendList, pendingInvitations, acceptInvitation, rejectInvitation)}
        </ul>
      </aside>
    </>
  );
};

function ListMapper(list: Array<User>,
  pendingInvitations: { [key: number]: boolean },
  acceptInvitation: (friendId: number) => void,
  rejectInvitation: (friendId: number) => void
) {
  return (list.length > 0 ? (
    list.map((user) => (
      <li key={user.id} className="cursor-pointer flex items-center gap-20">
        
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div><FriendCard user={user} /></div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Ver perfil</ContextMenuItem>
            {user.connectionState !== ConnectionState.Playing &&
              <ContextMenuItem>Invitar a la partida</ContextMenuItem>
            }
            <ContextMenuItem>Borrar amigo</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {pendingInvitations[user.id] && (
          <div className="flex gap-5">
            <Button size="sm" onClick={() => acceptInvitation(user.id)}>✔</Button>
            <Button size="sm" onClick={() => rejectInvitation(user.id)}>✖</Button>
          </div>
        )}
      </li>
    ))) : <p className="body-text">No se ha podido cargar tus amigos</p>);
};

