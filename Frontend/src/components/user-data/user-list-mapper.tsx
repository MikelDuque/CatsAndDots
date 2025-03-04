"use client"

import { User } from "@/lib/types";
import UserCard from "./user-card";
import { ListType } from "@/lib/enums";

type userListProps = {
  userList?: User[],
  listType: ListType,
  onUserSelect?: () => void
}

export default function UserListMapper({userList, listType, onUserSelect}: userListProps) {
  const gridType = ![ListType.friends, ListType.matchmaking].includes(listType)  && "grid-cols-2";

  return(
    <ul className={`text-body grid gap-1 ${gridType}`}>
      {userList ? userList.map(
        (user) =>
          <UserCard key={user.id} user={user} listType={listType} onUserSelect={onUserSelect}/>
        ) : <p className="body-text">No se han podido cargar los usuarios</p>
      }
    </ul>
  );
};