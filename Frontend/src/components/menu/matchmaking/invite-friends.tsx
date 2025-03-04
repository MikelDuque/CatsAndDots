"use client"

import { useState } from "react";
import {useFriendList} from "@/features/user-list/useFriendList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

import { ListType } from "@/lib/enums";
import UserListMapper from "@/features/user-list/components/user-list-mapper";

export default function InviteFriends() {
  const {friendList} = useFriendList();
  const [showFriendsModal, setShowFriendsModal] = useState(false);

  function handleUserClick() {setShowFriendsModal(prevState => !prevState)};

  return (
    <Dialog open={showFriendsModal} onOpenChange={setShowFriendsModal}>
      <DialogTrigger asChild>
        <Plus size="25%" className="cursor-pointer"/>
      </DialogTrigger>
      <DialogContent className="w-1/4">
        <DialogHeader>
          <DialogTitle> Invita un amigo</DialogTitle>
        </DialogHeader>
        <UserListMapper userList={friendList} listType={ListType.matchmaking} onUserSelect={handleUserClick}/>
      </DialogContent>
    </Dialog>
  );
};