"use client"

import Header from "@/components/header/header";
import MenuSection from "@/components/menu/menu-section";
import FriendList from "@/components/friend-list/friend-list";
import ThemeSwitcher from "@/components/theme/theme-switcher";

export default function Menu() {
  return (
    <>
      <Header/>
      <main className="flex size-full">
        <MenuSection/>
        <FriendList/>
        <ThemeSwitcher />
      </main>
    </>
  );
}