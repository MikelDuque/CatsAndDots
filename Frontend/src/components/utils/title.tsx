"use client"

import { useTheme } from "next-themes"

interface TitleProps {
  children: React.ReactNode;
  moreClasses?: string;
}

export default function Title({children, moreClasses}: TitleProps) {
  const { theme } = useTheme();
  
  return (
    <h1 className={`title ${theme === "light" ? "font-ribeye" : "font-audiowide"} ${moreClasses}`}>{children}</h1>
  );
};