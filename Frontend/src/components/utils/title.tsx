"use client"

import { useTheme } from "next-themes"

export default function Title({children, moreClasses}) {
  const { theme } = useTheme();
  
  return (
    <h1 className={`title ${theme === "light" ? "font-ribeye" : "font-audiowide"} ${moreClasses}`}>{children}</h1>
  );
};