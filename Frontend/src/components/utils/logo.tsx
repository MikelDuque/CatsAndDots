"use client"

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Logo() {
  const {theme} = useTheme();
  const [currentLogo, setCurrentLogo] = useState<string>("/logo.png");

  useEffect(() => {
    setCurrentLogo(theme === "light" ? "/logo.png" : "/logo-noche.png");
  }, [theme]);

  return (
    <Image
      src={currentLogo}
      alt="Logo"
      quality={100}
      height={750}
      width={750}
    />
  );
};