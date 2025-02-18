import { useWebsocket } from "@/features/websocket/websocket-context";
import { Request } from "@/lib/enums";
import { FriendRequest, GameRequest, MatchmakingRequest } from "@/lib/types";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function PlayRequest(thisUserId: number) {
  const { socket, messages } = useWebsocket();
  const [requests, setRequests] = useState<Set<GameRequest>>(new Set());

  useEffect(() => {
    const backFriendRequest = messages ? messages["FriendRequest"] as FriendRequest : undefined;
    const backMatchmakingRequest = messages ? messages["GameInvitation"] as MatchmakingRequest : undefined;

    const friendRequest = 

    if (matchmaking?.Action === "InviteFriend") {
      const gameRequest = {
        HostId: matchmaking?.HostId,
        RequestState: Request.Pending
      }
      
      setRequests(prevState => ({...prevState, gameRequest}));
    }
  }, [messages]);

  return (
    requests.size > 0 && requests.forEach(request =>
      request.HostId === thisUserId && 
      <div className="flex gap-5">
        <Button size="sm">✔</Button>
        <Button size="sm">✖</Button>
      </div>
    )
  );
}