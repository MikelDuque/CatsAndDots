"use client"

import { Button } from "@/components/ui/button";
import { ChevronLeft, MessageCircleMore } from "lucide-react";
import { useState } from "react";

export default function Chat() {
  const [hideChat, setHideChat] = useState(false);

  function OnHide() {setHideChat(previousState => !previousState)};

  return (
    <>
      {hideChat && 
        <Button variant="ghost" onClick={OnHide} className={`absolute right-0 text-white ${hideChat ? "" : "hidden"}`}>
          <ChevronLeft/><MessageCircleMore/>
        </Button >
      }
      <aside className={`p-2 flex flex-col w-1/5 h-full justify-self-end bg-secondary gap-5 ${hideChat && "fixed right-full"}`}>
        Hola
      </aside>
    </>
  );
};