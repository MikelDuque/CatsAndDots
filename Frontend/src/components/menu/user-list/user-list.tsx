"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { UserPlus } from "lucide-react";
import { Button } from "../../ui/button";
import Title from "../../utils/title";
import { useAuth } from "@/features/auth/auth-context";
import useFetch from "@/features/endpoints/useFetch";
import { GET_PENDING_FRIENDS} from "@/features/endpoints/endpoints";
import { useEffect, useState } from "react";
import { PendingFriends, User } from "@/lib/types";
import UserSearch from "./user-search";
import UserListMapper from "@/components/user-data/user-list-mapper";
import { useRequest } from "@/features/websocket/request-context";

export default function UserList() {
  const { token, decodedToken } = useAuth();
  const { friendRequests } = useRequest();

  const { fetchData } = useFetch({ url: GET_PENDING_FRIENDS(decodedToken?.id || 0), type: 'GET', token: token, needAuth: true, condition: !!token });
  
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [pendingFriends, setPendingFriends] = useState<PendingFriends>({
    receivedFriendRequests: [],
    sentFriendRequests: []
  });

  useEffect(() => {
    if (fetchData) {
      const backPendingFriends = fetchData as PendingFriends
      
      setPendingFriends(backPendingFriends);
    };

  }, [fetchData]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><UserPlus /></Button>
      </DialogTrigger>
      <DialogContent className="bg-popover">
        <DialogHeader>
          <DialogTitle><Title>Búsqueda de Usuarios</Title></DialogTitle>
        </DialogHeader>
        <div>
          <UserSearch setDisplayUserList={setDisplayedUsers}/>
          <div>
          <UserListMapper userList={displayedUsers} requests={friendRequests} isFriendList={false}/>
          <UserListMapper userList={pendingFriends.receivedFriendRequests} requests={friendRequests} isFriendList={false}/>
          <UserListMapper userList={pendingFriends.sentFriendRequests} requests={friendRequests} isFriendList={false}/>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};