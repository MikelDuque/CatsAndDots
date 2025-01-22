"use client"

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import LoginForm from "@/components/auth/login-form"
import { useRouter } from 'next/navigation'
import RegisterForm from "@/components/auth/register-form";
import ThemeSwitcher from "@/components/theme/theme-switcher";

export default function Login() {
  const router = useRouter()
  return (
    <>
      <header className="fixed">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}><ChevronLeft /></Button>
      </header>
      <main className="h-screen w-screen flex justify-center items-center">
        <LoginForm/>
        <RegisterForm/>
        <ThemeSwitcher/>
      </main>
    </>
  );
}