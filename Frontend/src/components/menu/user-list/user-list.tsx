"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { UserPlus } from "lucide-react";
import { Button } from "../../ui/button";
import { useAuth } from "@/features/auth/auth-context";
import useFetch from "@/features/endpoints/useFetch";
import { GET_PENDING_FRIENDS} from "@/features/endpoints/endpoints";
import { useEffect, useState } from "react";
import { PendingFriends, User } from "@/lib/types";
import UserSearch from "./user-search";
import UserListMapper from "@/components/user-data/user-list-mapper";
import { useRequest } from "@/features/websocket/request-context";
import Title from "@/components/utils/title";

export default function UserList() {
  const { token, decodedToken } = useAuth();
  const { friendRequests } = useRequest();
  
  const { fetchData } = useFetch({ url: GET_PENDING_FRIENDS(decodedToken?.id || 0), type: 'GET', token: token, needAuth: true, condition: !!token });
  
  const [displayedUsers, setDisplayedUsers] = useState<User[] | undefined>(undefined);
  const [pendingFriends, setPendingFriends] = useState<PendingFriends>({
    receivedFriendList: [],
    sentFriendList: []
  });

  useEffect(() => {
    if (fetchData) {
      const backPendingFriends = fetchData as PendingFriends
      
      setPendingFriends(backPendingFriends);
    };

  }, [fetchData, friendRequests]);
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><UserPlus/></Button>
      </DialogTrigger>
      <DialogContent className="bg-popover">
        <DialogHeader>
          <DialogTitle><Title>Búsqueda de Usuarios</Title></DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <UserSearch setDisplayUserList={setDisplayedUsers}/>
          {displayedUsers ?
            displayedUsers.length > 0 ?
              <UserListMapper userList={displayedUsers} requests={friendRequests} isFriendList={false}/>
            :
            <p className="text-body">No se ha encontrado a ningún usuario con ese nombre</p>
          :
            <>
              <section>
                <h3 className="subtitle text-left">Peticiones de amistad recibidas</h3>
                <UserListMapper userList={pendingFriends.receivedFriendList} requests={friendRequests} isFriendList={false}/>
              </section>
              <section>
                <h3 className="subtitle text-left">Peticiones de amistad enviadas</h3>
                <UserListMapper userList={pendingFriends.sentFriendList} requests={friendRequests} isFriendList={false}/>
              </section>
            </>
          }
        </div>
      </DialogContent>
    </Dialog>
  );
};