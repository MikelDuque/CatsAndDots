"use client"

import { useTheme } from "next-themes"
import Image from "next/image";
  import LogoDia from "@/../public/logo.png";
  import LogoNoche from "@/../public/logo-noche.png";
import { Button } from "@/components/ui/button";
import Title from "../utils/title";

export default function Section01() {
  const {theme} = useTheme();
  return(
    <section className="h-screen flex flex-col gap-10 pt-20 items-center">
      <figure>
        <Image src={theme === "light" ? LogoDia : LogoNoche} alt="Logo"/>
      </figure>
      <figure className="w-full h-2/5 flex items-center justify-center bg-cover bg-center bg-fixed bg-[url('@/../public/Home/gato-big-bg.jpg')]  bg-black/50 bg-blend-overlay">
        <Button className="p-10">
          <Title moreClasses="text-4xl">Play now!</Title>
        </Button>
      </figure>
    </section>
  );
};