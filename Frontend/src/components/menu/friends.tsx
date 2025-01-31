"use client";

import { useState, useEffect } from "react";
import { useWebsocketContext } from "@/features/websocket/contextApi";
import { Button } from "../ui/button";


interface Friend {
  id: number;
  name: string;

}

export default function Friends() {
  const { data } = useWebsocketContext();
  const [friends, setFriends] = useState<Friend[]>([]);


  useEffect(() => {
    if (data.friends) {
      setFriends(data.friends);
    }
  }, [data]);

  return (
    <aside className="flex flex-col w-1/4 h-screen  p-8 bg-secondary">
      <form className="flex">
        <input
          type="search"
          defaultValue={""}
          placeholder={"buscar Amigo"}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" >
          🔎
        </Button>
      </form>
      <h1>Lista de amigos:</h1>
      <ul>
        {friends.length === 0 ? (
          <p>No tienes amigos en línea.</p>
        ) : (
          friends.map((friend) => (
            <li key={friend.id}>{friend.name}</li>
          ))
        )}
      </ul>

    </aside>
  );
}
