"use client"

import { Check, Cross } from "lucide-react";
import { Button } from "../ui/button";
import { useRequest } from "@/features/websocket/request-context";
import { Request } from "@/lib/types";
import { RequestState } from "@/lib/enums";

type RequestInteractionProps = {
  thisUserId: number,
  request: Request,
  isGameRequest: boolean
}

export default function RequestInteraction({thisUserId, request, isGameRequest}: RequestInteractionProps) {
  const { sendRequest } = useRequest();

  function changeState(newState: RequestState) {
    sendRequest({...request, state: newState}, isGameRequest);
  }

  return (
    <>
      {thisUserId === request.receiverId && 
      <div className="flex gap-5">
        <Button size="sm" onClick={() => changeState(RequestState.Accepted)}><Check/></Button>
        <Button size="sm" onClick={() => changeState(RequestState.Rejected)}><Cross/></Button>
      </div>
      }
      {thisUserId === request.senderId && 
      <Button size="sm" className="text-body" onClick={() => sendRequest(request, isGameRequest)}>Invitar</Button>
      }
      </>
  );
}