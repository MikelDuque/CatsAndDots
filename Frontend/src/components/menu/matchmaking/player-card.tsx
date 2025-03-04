"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Title from "@/components/utils/title";
import { BASE_HTTPS_URL } from "@/features/endpoints/endpoints";
import { User } from "@/lib/types";
import InviteFriends from "./invite-friends";
import { Crown } from "lucide-react";

type playerCardProps = {
  player?: User,
  isHost: boolean
}

export default function PlayerCard({player, isHost}: playerCardProps) {
  return (
    <div className="relative">
      {isHost && <Crown size={50} className="absolute left-1/2 -top-12 -translate-x-1/2"/>}
      <figure className={`size-52 flex justify-center items-center rounded-full ${!player && "bg-gray-500/50"}`}>
        {player ? 
        <Avatar className="size-full">
          <AvatarImage src={`${BASE_HTTPS_URL}${player.avatar}`}/>
          <AvatarFallback delayMs={600} className="title">
            {player.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        : 
        <InviteFriends/>
        }
      </figure>
      <Title moreClasses="absolute left-1/2 -bottom-12 -translate-x-1/2 text-4xl">{player?.username}</Title>
    </div>
  );
};