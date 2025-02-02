import { useWebsocketContext } from "@/features/websocket/contextApi";
import { MenuData } from "@/lib/types";
import { Dices, Swords, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type thisMenuData = {
  basicData: MenuData
  friendList: unknown
}

export default function BasicData() {
  const {message, socket} = useWebsocketContext();

  const [menuData, setMenuData] = useState<thisMenuData>({
    basicData: null,
    friendList: null
  });
  
  /*
  const menuData = useRef<MenuData>(null);
  const friendList = useRef<unknown>(unknown);
  */

  useEffect(() => {
    setMenuData({
      basicData: message?.Body as MenuData,
      friendList: message?.Body
    })
  }, [socket])

  /*
  if (message?.MessageType === "MenuData") menuData.current = message.Body as MenuData;
  if (message?.MessageType === "FriendList") friendList.current = message.Body;
  */

  return (
    <div className="flex gap-5 items-center">
      <div className="flex gap-2"><Users/> {menuData?.basicData?.OnlineUsers || 0}</div>
      <div className="flex gap-2"><Swords/> {menuData?.basicData?.PlayingUsers || 0}</div>
      <div className="flex gap-2"><Dices/> {menuData?.basicData?.CurrentMatches || 0}</div>
    </div>
  );
}