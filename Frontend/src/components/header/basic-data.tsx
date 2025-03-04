import { useWebsocket } from "@/features/websocket/websocket-context";
import { MenuData } from "@/lib/types";
import { Dices, Swords, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function BasicData() {
  const {messages} = useWebsocket();
  const [menuData, setMenuData] = useState<MenuData>();
  
  useEffect(() => { 
    if(messages) setMenuData(messages["MenuData"] as MenuData);
  }, [messages]);

  return (
    <div className="flex gap-5 items-center">
      <div className="flex gap-2"><Users/> {menuData?.onlineUsers || 0}</div>
      <div className="flex gap-2"><Swords/> {menuData?.playingUsers || 0}</div>
      <div className="flex gap-2"><Dices/> {menuData?.currentMatches || 0}</div>
    </div>
  );
}