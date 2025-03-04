"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react";

interface TitleProps {
  children: React.ReactNode;
  moreClasses?: string;
}

export default function Title({children, moreClasses}: TitleProps) {
  const { theme } = useTheme();

  const [currentFont, setCurrentFont] = useState<string>("font-ribeye");

  useEffect(() => {
    setCurrentFont(theme === "light" ? "font-ribeye" : "font-audiowide");
  }, [theme]);

  
  return (
    <h1 className={`title ${currentFont} ${moreClasses}`}>{children}</h1>
  );
};