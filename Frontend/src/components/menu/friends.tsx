"use client";

import { useState, useEffect } from "react";
import { useWebsocketContext } from "@/features/websocket/contextApi";


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
    <aside className="flex-col w-1/4 h-screen  p-8 bg-secondary">
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
