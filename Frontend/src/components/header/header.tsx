"use client"

import ProfileInfo from "./profile-info";
import BasicData from "./basic-data";

export default function Header() {
  return (
    <header className="h-[7.5%] flex justify-between items-center py-2 px-3 bg-secondary shadow-md">
      <BasicData/>
      <ProfileInfo/>
    </header>
  );
}
