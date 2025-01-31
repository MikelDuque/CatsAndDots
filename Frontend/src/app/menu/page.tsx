"use client"

import MenuHeader from "@/components/menu/menuHeader";
import Friends from "@/components/menu/friends";
import ThemeSwitcher from "@/components/theme/theme-switcher";
import { Button } from "@/components/ui/button";
import Title from "@/components/utils/title";
import { getAuth } from "@/features/auth/queries/get-auth";
import { useEffect, useState } from "react";
import { useWebsocketContext } from "@/features/websocket/contextApi";

export default function Menu() {
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [userImg, setUserImg] = useState<string | undefined>(undefined);
  const {setToken} = useWebsocketContext();

  useEffect(() => {
    async function GetDecodedToken() {
      const { decodedToken, token } = await getAuth();

      setToken(token);
      
      setUsername(decodedToken?.unique_name)
      setUserImg(decodedToken?.avatar)
      console.log(decodedToken?.avatar, "AAAAHHHH")
    }

    GetDecodedToken();
  }, [])




  return (
    <>
      <main>
        <MenuHeader username={username} userImg={userImg} />
        <section className="flex justify-center items-center justify-between">
          <Button className="ml-[200] shadow-md shadow-slate-700 " >
            <Title moreClasses="text-4xl">Buscar Partida</Title>
          </Button>
          <Friends />
        </section>
      </main>
      <ThemeSwitcher />
      <Button variant="default" size="icon" className="fixed top-20 left-5">
        🔎
      </Button>
    </>
  );
}