"use client"

import { useTheme } from "next-themes"
import Image from "next/image";
import Title from "../utils/title";
import { useEffect, useState } from "react";


interface InfoCardProps {
  children: React.ReactNode;
  title: string;
  img: string;
}

function InfoCard({children, title, img}:InfoCardProps ) {
  const {theme} = useTheme();
    const [currentBorder, setCurrentBorder] = useState<string>("#7741bf");
  
    useEffect(() => {
      setCurrentBorder(theme === "light" ? "#7741bf" : "#fff3b0");
    }, [theme]);

  return (
    <div className="max-w-xs flex flex-col items-center gap-5">
      <Title>{title}</Title>
      <Image
        src={img}
        alt={"info image"}
        height={500}
        width={500}
        className={`border-4 rounded-lg border-[${currentBorder}]"`}
      />
      <p className="text-body text-md">{children}</p>
    </div>
  )
}

export default InfoCard;

