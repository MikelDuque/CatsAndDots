"use client"

import Header from "@/components/header/header";
import MenuSection from "@/components/menu/menu-section";
import FriendList from "@/components/friend-list/friend-list";
import ThemeSwitcher from "@/components/theme/theme-switcher";
import Modal from "@/features/modal/Modal";

export default function Menu() {
  return (
    <>
      <Header/>
      <main className="flex size-full">
        <Modal type="UserSearch" title="Búsqueda de Usuario">
          AQUI VA LA MODAL
        </Modal>
        <MenuSection/>
        <FriendList/>
        <ThemeSwitcher />
      </main>
    </>
  );
}