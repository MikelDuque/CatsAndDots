"use client"

import { useWebsocketContext } from "@/features/websocket/contextApi";
import { Button } from "../ui/button";
import { useRouter } from 'next/navigation'
import { LogOut } from "@/features/auth/actions/server-actions";
import Image from "next/image";
import { BASE_HTTPS_URL } from "@/lib/endpoints";
import { GenericMessage, MenuData } from "@/features/auth/types";
import { useRef } from "react";
import { unknown } from "zod";

interface MenuHeaderProps {
  username: string | undefined;
  userImg: string | undefined;
}

export default function MenuHeader({ username, userImg }: MenuHeaderProps) {

  const {data} = useWebsocketContext();
  const router = useRouter();

  const menuData = useRef<MenuData>(null);
  const friendList = useRef<unknown>(unknown);

  if (data?.MessageType === "MenuData") menuData.current = data.Body as MenuData;
  if (data?.MessageType === "FriendList") friendList.current = data.Body;

  console.log("data", data);
  console.log("data body", data?.Body);
  console.log("data type", data?.MessageType);
  
  
  console.log("data onlineusers", data?.Body?.OnlineUsers);
  console.log("menudata", menuData.current);
  console.log("friendlist", friendList.current);
  
  
  

  const handleClick = () => {
    LogOut();

    router.push("/");
  }

  return (
    <header className="flex justify-between p-4 bg-secondary">
      <section className="flex gap-12">
        <div>Usuarios conectados: {menuData?.current?.OnlineUsers}</div>
        <div>Usuarios en partida: {menuData?.current?.PlayingUsers}</div>
        <div>Partidas en curso: {menuData?.current?.CurrentMatches}</div>
      </section>

      <section className="flex justify-center items-center gap-8">
        <div>
          <Button onClick={handleClick}>
            Cerrar sesion
          </Button>

        </div>
        <div>
          Hola {username}
        </div>
        <figure className="relative aspect-square max-w-[40px] max-h-[40px]">
          <img src={`${BASE_HTTPS_URL}${userImg}`} alt="" />
        </figure>


      </section>
    </header>
  );
}
