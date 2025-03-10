"use client"

import { useRouter } from 'next/navigation'
import Image from "next/image"
  import logo from "@/../public/Home/gato_naranja.png"
import { Button } from "../ui/button";
import Title from "../utils/title";
import { menuPath } from '@/lib/paths';

export default function Header() {
  const router = useRouter();
  function scrollToTop() {return document.getElementById('section01')?.scrollIntoView({behavior: 'smooth'})};

  return(
    <header className="h-14 fixed flex items-center w-screen top-0 justify-between py-1 px-3 shadow-md bg-background">
     <figure className="relative aspect-square h-4/5 cursor-pointer" onClick={scrollToTop}>
      <Image 
        src={logo} 
        alt={"logo"}
        fill
        />
     </figure>
      
      <Button onClick={() => router.push(menuPath)}>
        <Title moreClasses="text-sm">Play now!</Title>
      </Button>
    </header>
  )
}