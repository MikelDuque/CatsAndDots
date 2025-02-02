"use client"

import ProfileInfo from "./profile-info";
import BasicData from "./basic-data";

export default function Header() {
  return (
    <header className="h-14 flex justify-between py-2 px-3 bg-secondary">
      <BasicData/>
      <ProfileInfo/>
    </header>
  );
}
