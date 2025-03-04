"use client"

import { useAuth } from "@/features/auth/auth-context";
import { GET_ALL_USERS } from "@/features/endpoints/endpoints";
import useFetch from "@/features/endpoints/useFetch";
import { UserData } from "@/lib/types";
import { useEffect, useState } from "react";
import UserElement from "./user";

export default function HandleUser() {
  const [users, setUsers] = useState<UserData[]>([]);
  const { token, decodedToken } = useAuth();

  const {fetchData, fetchError} = useFetch({url: GET_ALL_USERS, type: 'GET', token: token, needAuth: true, condition: !!token});

  useEffect(() => {
    if(fetchData) setUsers(fetchData as UserData[]);
  }, [fetchData]);

  function handleUpdate() {

  }

  function shouldDelete() {

  }

  return (
   <div>
    {fetchError ? <p>{String(fetchError)}</p> : 
      <ul className={`text-body grid gap-1`}>
        {users ? users.map(
          (user) =>
            <UserElement user={user} changeRol={handleUpdate} deleteUser={shouldDelete}/>
          ) : <p className="body-text">No se han podido cargar los usuarios</p>
        }
      </ul>
    }
   </div>
  )
};