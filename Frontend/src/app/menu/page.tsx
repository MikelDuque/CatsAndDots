"use client"

import { useState, useEffect } from "react";
import { useWebsocketContext } from "@/features/websocket/contextApi";
import MenuHeader from "@/components/menu/menuHeader";
import Friends from "@/components/menu/friends";
import ThemeSwitcher from "@/components/theme/theme-switcher";
import { Button } from "@/components/ui/button";
import Title from "@/components/utils/title";

export default function Menu() {
  
  const { isConnected, token } = useWebsocketContext();
 console.log("is connected", isConnected)

  return (
    <>
      <main>
        <MenuHeader decodedToken={token.decodeToken} />
        <section className="flex justify-center items-center">
          <Button className="p-10 shadow-md shadow-slate-700 " >
            <Title moreClasses="text-4xl">Buscar Partida</Title>
          </Button>
        </section>

        <Friends />
      </main>
      <ThemeSwitcher />
    </>
  );
}