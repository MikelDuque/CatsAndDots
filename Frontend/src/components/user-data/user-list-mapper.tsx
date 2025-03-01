"use client"

import { Request, User } from "@/lib/types";
import UserCard from "./user-card";

type userListProps = {
  userList: Array<User>,
  requests: Record<number, Request>,
  isFriendList: boolean
}

export default function UserListMapper({userList, requests, isFriendList}: userListProps) {
  const gridType = !isFriendList && "grid-cols-4";

  return(
    <ul className={`text-body grid gap-1 ${gridType}`}>
      {userList.length > 0 ?
        userList.map((user) =>
          <li key={user.id} className="cursor-pointer flex items-center gap-20">
            <UserCard user={user} request={requests[user.id]} isFriend={isFriendList}/>
          </li>
        ) : <p className="body-text">No se han podido cargar los usuarios</p>
      }
    </ul>
  );
};