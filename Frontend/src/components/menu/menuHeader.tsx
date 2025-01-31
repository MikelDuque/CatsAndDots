"use client"

import { useWebsocketContext } from "@/features/websocket/contextApi";
import { Button } from "../ui/button";
import { useRouter } from 'next/navigation'
import { LogOut } from "@/features/auth/actions/server-actions";
import Image from "next/image";
import { BASE_HTTPS_URL } from "@/lib/endpoints";

interface MenuHeaderProps {
  username: string | undefined;
  userImg: string | undefined;
}

export default function MenuHeader({ username, userImg }: MenuHeaderProps) {

  const { data } = useWebsocketContext();
  const router = useRouter()

  const handleClick = () => {
    LogOut();

    router.push("/");
  }

  return (
    <header className="flex justify-between p-4 bg-secondary">
      <section className="flex gap-12">
        <div>Usuarios conectados: {data.onlineUsers}</div>
        <div>Usuarios en partida: {data.playingUsers}</div>
        <div>Partidas en curso: {data.currentMatches}</div>
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
