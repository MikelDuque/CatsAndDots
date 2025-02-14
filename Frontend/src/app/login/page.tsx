"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import LoginForm from "@/components/auth/login-form";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/auth/register-form";
import ThemeSwitcher from "@/components/theme/theme-switcher";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [flipCard, setFlipCard] = useState(false);

  function OnFlip() {setFlipCard(previousState => !previousState)};

  return (
    <>
      <header className="fixed">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ChevronLeft />
        </Button>
      </header>
      <main className="size-full flex justify-center items-center">
        <div className="relative w-1/4 h-4/5 [perspective:1000rem]">
          <LoginForm hasFlip={flipCard} flipCard={OnFlip}/>
          <RegisterForm hasFlip={flipCard} flipCard={OnFlip}/>
        </div>
        
        
        <ThemeSwitcher />
      </main>
    </>
  );
}