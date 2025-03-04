"use client"

import Header from "@/components/header/header";
import MenuSection from "@/components/menu/menu-section";
import FriendList from "@/components/menu/friend-list/friend-list";
import ThemeSwitcher from "@/features/theme/components/theme-switcher";
import Matchmaking from "@/components/menu/matchmaking/matchmaking";
import { useRequest } from "@/features/websocket/request-context";

export default function Menu() {
  const { setMeInMatchmaking, meInMatchmaking } = useRequest();
  
  return (
    <>
      <Header />
      <main className="h-[92.5%] w-full flex">
        {meInMatchmaking ? 
          <Matchmaking onBack={setMeInMatchmaking} />
        : 
          <MenuSection onSelect={setMeInMatchmaking} />
        }
        <FriendList />
      </main>
      <ThemeSwitcher />
    </>
  );
}