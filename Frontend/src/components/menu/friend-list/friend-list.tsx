"use client"

import { useState } from "react";
//UTILS
import { User } from "@/lib/types";
//COMPONENTS
import UserList from "../user-list/user-list";
import UserListMapper from "../../user-data/user-list-mapper";
import Title from "../../utils/title";
import FriendSearch from "./friend-search";
//SHADCN
import { Button } from "../../ui/button";
//LUCIDE
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { ListType } from "@/lib/enums";


export default function FriendList() {
  const [hideFriends, setHideFriendlist] = useState(false);
  const [displayFriendList, setDisplayFriendlist] = useState<User[]>([]);

  function OnHide() {setHideFriendlist(previousState => !previousState)};

  return (
    <>
      {hideFriends &&
        <Button onClick={OnHide} className={`absolute mt-3 right-2 ${hideFriends ? "" : "hidden"}`}>
          <ChevronLeft/><Users/>
        </Button >
      }

      <aside className={`p-2 min-w-[25%] flex flex-col bg-secondary gap-5 ${hideFriends && "fixed right-full"}`}>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={OnHide}><ChevronRight /></Button >
          <Title moreClasses="w-full">Amigos</Title>
          <UserList />
        </div>
        <FriendSearch setDisplayFriendList={setDisplayFriendlist}/>
        <UserListMapper userList={displayFriendList} listType={ListType.friends} />
      </aside>
    </>
  );
};