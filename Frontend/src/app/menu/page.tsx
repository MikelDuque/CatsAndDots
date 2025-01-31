"use client"

import MenuHeader from "@/components/menu/menuHeader";
import Friends from "@/components/menu/friends";
import ThemeSwitcher from "@/components/theme/theme-switcher";
import { Button } from "@/components/ui/button";
import Title from "@/components/utils/title";
import { getAuth } from "@/features/auth/queries/get-auth";
import { useEffect, useState } from "react";

export default function Menu() {
  const [userData, setUserData] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    async function GetDecodedToken() {
      const {decodedToken} = await getAuth();
      setUserData(decodedToken?.unique_name)
    
    }
    
    GetDecodedToken();
  }, [])
  

  return (
    <>
      <main>
        <MenuHeader decodedToken={userData} />
        <section className="flex justify-center items-center justify-between">
          <Button className="ml-[200] shadow-md shadow-slate-700 " >
            <Title moreClasses="text-4xl">Buscar Partida</Title>
          </Button>
          <Friends />
        </section>
        
      </main>
      <ThemeSwitcher />
    </>
  );
}