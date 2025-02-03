import { useWebsocketContext } from "@/features/websocket/contextApi";
import { MenuData } from "@/lib/types";
import { Dices, Swords, Users } from "lucide-react";
import { useEffect, useRef } from "react";

export default function BasicData() {
  const {message} = useWebsocketContext();
  const menuData = useRef<MenuData>(undefined);

  useEffect(() => {
    if(message?.MessageType === "MenuData") menuData.current = message?.Body as MenuData;
  }, [message]);

  return (
    <div className="flex gap-5 items-center">
      <div className="flex gap-2"><Users/> {menuData?.current?.OnlineUsers || 0}</div>
      <div className="flex gap-2"><Swords/> {menuData?.current?.PlayingUsers || 0}</div>
      <div className="flex gap-2"><Dices/> {menuData?.current?.CurrentMatches || 0}</div>
    </div>
  );
}