"use client"

import { useState } from "react";
import { useRequest } from "@/features/websocket/request-context";
import {useFriendList} from "@/features/websocket/useFriendList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import UserListMapper from "@/components/user-data/user-list-mapper";

export default function InviteFriends() {
  const {friendList} = useFriendList();
  const {gameRequests} = useRequest();
  const [showFriendsModal, setShowFriendsModal] = useState(false);

  return (
    <Dialog open={showFriendsModal} onOpenChange={setShowFriendsModal}>
      <DialogTrigger asChild>
        <Plus size="25%" className="cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Invita un amigo</DialogTitle>
        </DialogHeader>
        <UserListMapper userList={friendList} requests={gameRequests} isFriendList={true}/>
      </DialogContent>
    </Dialog>
  );
};