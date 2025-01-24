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
  const [currentView, setCurrentView] = useState<"login" | "register">("login");

  return (
    <>
      <header className="fixed">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ChevronLeft />
        </Button>
      </header>
      <main className="h-screen w-screen flex justify-center items-center">
        {currentView === "login" && (<LoginForm onSwitchToRegister={() => setCurrentView("register")} />)}
        {currentView === "register" && (<RegisterForm onSwitchToLogin={() => setCurrentView("login")} />)}
        <ThemeSwitcher />
      </main>
    </>
  );
}
