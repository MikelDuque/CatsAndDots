"use client"

import Header from "@/components/header/header";
import MenuSection from "@/components/menu/menu-section";
import FriendList from "@/components/menu/friend-list/friend-list";
import ThemeSwitcher from "@/components/theme/theme-switcher";
import Matchmaking from "@/components/menu/matchmaking/matchmaking";
import { useState } from "react";

export default function Menu() {
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  

  return (
    <>
      <Header />
      <main className="flex w-full h-[92.5%]">
        {showMatchmaking ? 
          <Matchmaking onBack={() => setShowMatchmaking(false)} />
        : 
          <MenuSection onSelect={() => setShowMatchmaking(true)} />
        }
        <FriendList />
      </main>
      <ThemeSwitcher />
    </>
  );
}