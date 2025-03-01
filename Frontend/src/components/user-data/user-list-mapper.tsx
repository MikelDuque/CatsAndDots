"use client"

import { Request, User } from "@/lib/types";
import UserCard from "./user-card";

type userListProps = {
  userList?: Array<User>,
  requests: Request[],
  isFriendList: boolean
}

export default function UserListMapper({userList, requests, isFriendList}: userListProps) {
  const gridType = !isFriendList && "grid-cols-2";

  return(
    <ul className={`text-body grid gap-1 ${gridType}`}>
      {userList ?
        userList.map((user) =>
          <li key={user.id} className="cursor-pointer flex items-center gap-20">
            <UserCard user={user} request={getRequest(requests, user.id)} isFriend={isFriendList}/>
          </li>
        ) : <p className="body-text">No se han podido cargar los usuarios</p>
      }
    </ul>
  );
};

function getRequest(requests: Request[], id: number) {
  return requests.find(request => request.senderId === id);
};