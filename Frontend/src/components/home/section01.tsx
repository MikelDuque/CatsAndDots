"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import Title from "../utils/title";
import { menuPath } from "@/lib/paths";
import Logo from "../utils/logo";

export default function Section01() {
  const router = useRouter();
  
  return(
    <section id="section01" className="h-screen flex flex-col gap-10 justify-center items-center snap-start">
      <Logo/>
      <figure className="w-full h-2/5 flex items-center justify-center bg-cover bg-center bg-fixed bg-[url('/Home/gato-big-bg.jpg')]  bg-black/50 bg-blend-overlay">
          <Button className="p-10 shadow-md shadow-slate-700" onClick={() => router.push(menuPath)}>
            <Title moreClasses="text-4xl">Play now!</Title>
          </Button>
      </figure>
    </section>
  );
};