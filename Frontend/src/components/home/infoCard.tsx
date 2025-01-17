"use client"

import { useTheme } from "next-themes"
import Image, { StaticImageData } from "next/image";
import Title from "../utils/title";


interface InfoCardProps {
  children: string;
  title: string;
  img: StaticImageData;
}

function InfoCard({children, title, img}:InfoCardProps ) {
  const {theme} = useTheme();
  return (
    
    <div className="max-w-xs flex flex-col items-center gap-10">
      <Title>{title}</Title>
      <Image
        src={img}
        alt={"info image"}
        className={theme === "light" ? "border-4 border-[#7741bf] rounded-lg" :"border-4 border-[#fff3b0] rounded-lg"}
      />
      <p className="text-body text-lg">{children}</p>
    </div>
  )
}

export default InfoCard;

