"use client"

import MenuHeader from "@/components/menu/menuHeader";
import Friends from "@/components/menu/friends";
import ThemeSwitcher from "@/components/theme/theme-switcher";
import { Button } from "@/components/ui/button";
import Title from "@/components/utils/title";
import { getAuth } from "@/features/auth/queries/get-auth";
import { useEffect } from "react";

export default function Menu() {
  var username;
  useEffect(() => {
    async function GetDecodedToken() {
      const {decodedToken} = await getAuth();
      username=decodedToken?.unique_name
    }

  }, [])
  

  return (
    <>
      <main>
        <MenuHeader decodedToken={username} />
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