"use client"

import { useWebsocket } from "../websocket/websocket-context";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { useAuth } from "../auth/auth-context";
import useFetch from "../endpoints/useFetch";
import { GET_FRIEND_LIST } from "../endpoints/endpoints";

export function useFriendList() {
  const { token, decodedToken } = useAuth();
  const { messages } = useWebsocket();

  const { fetchData } = useFetch({ url: GET_FRIEND_LIST(decodedToken?.id || 0), type: "GET", token: token, needAuth: true, condition: !!token });

  const [friendList, setFriendlist] = useState<User[]>([]);

  useEffect(() => {
    if (fetchData) setFriendlist(fetchData as User[]);
  }, [fetchData]);

  useEffect(() => {
    if(!messages) return;
    const user = messages["UserData"] as User;

    if(!user) return;
    setFriendlist(previousState => {
      const exists = previousState.some(friend => friend.id === user.id);
      if(!exists) return [...previousState, user];

      return previousState.map(friend => {
        return friend.id === user.id ? user : friend
      });
    });
    
  }, [messages]);

  return {friendList};
};