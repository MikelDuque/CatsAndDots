"use client"

import { useTheme } from "next-themes"
import { useRouter } from 'next/navigation'
import Image from "next/image";
  import LogoDia from "@/../public/logo.png";
  import LogoNoche from "@/../public/logo-noche.png";
import { Button } from "@/components/ui/button";
import Title from "../utils/title";

export default function Section01() {
  const router = useRouter()
  const {theme} = useTheme();

  return(
    <section id="section01" className="h-screen flex flex-col gap-10 justify-center items-center snap-start">
      <figure className="w-2/3 flex justify-center">
        <Image src={theme === "light" ? LogoDia : LogoNoche} alt="Logo"/>
      </figure>
      <figure className="w-full h-2/5 flex items-center justify-center bg-cover bg-center bg-fixed bg-[url('@/../public/Home/gato-big-bg.jpg')]  bg-black/50 bg-blend-overlay">
        <Button className="p-10 shadow-md shadow-slate-700" onClick={() => router.push("/login")}>
          <Title moreClasses="text-4xl">Play now!</Title>
        </Button>
      </figure>
    </section>
  );
};