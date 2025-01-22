"use client"

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import LoginForm from "@/components/auth/loginForm"
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  return (
    <>
      <header>
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}><ChevronLeft /></Button>
      </header>
      <main className="max-w-md mx-auto mt-10">
        <LoginForm />
      </main>

    </>
  );
}