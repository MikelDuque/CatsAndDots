import { useWebsocketContext } from "@/features/websocket/contextApi";
import { MenuData } from "@/lib/types";
import { Dices, Swords, Users } from "lucide-react";
import { useRef } from "react";
import { unknown } from "zod";

export default function BasicData() {
  const {message} = useWebsocketContext();

  const menuData = useRef<MenuData>(null);
  const friendList = useRef<unknown>(unknown);

  if (message?.MessageType === "MenuData") menuData.current = message.Body as MenuData;
  if (message?.MessageType === "FriendList") friendList.current = message.Body;

  return (
    <div className="flex gap-12">
      <div><Users/> {menuData?.current?.OnlineUsers}</div>
      <div><Swords/> {menuData?.current?.PlayingUsers}</div>
      <div><Dices/> {menuData?.current?.CurrentMatches}</div>
    </div>
  );
}