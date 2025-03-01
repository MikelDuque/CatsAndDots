"use client"

import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { useRequest } from "@/features/websocket/request-context";
import { Request, User } from "@/lib/types";
import { ConnectionState, RequestState } from "@/lib/enums";

type RequestInteractionProps = {
  myUserId: number,
  otherUser: User,
  request?: Request,
  isGameRequest: boolean
}

export default function RequestInteraction({myUserId, otherUser, request, isGameRequest}: RequestInteractionProps) {
  const { sendRequest } = useRequest();

  function changeState(newState: RequestState) {
    if(!request) return; 

    sendRequest({...request, state: newState}, isGameRequest);
  }

  function inviteToGame() {
    if(!isGameRequest) return;

    const newRequest = {
      senderId: myUserId,
      receiverId: otherUser.id,
      state: RequestState.Pending
    };

    sendRequest(newRequest, isGameRequest);
  }

  return (
    <>
      {myUserId === request?.receiverId ?
      <div className="flex gap-1">
        <Button size="sm" onClick={() => changeState(RequestState.Accepted)}><Check/></Button>
        <Button size="sm" onClick={() => changeState(RequestState.Rejected)}><X/></Button>
      </div>
      : isGameRequest && otherUser.connectionState === ConnectionState.Online &&
      <Button size="sm" onClick={inviteToGame}>Invitar</Button>
      }
      </>
  );
}