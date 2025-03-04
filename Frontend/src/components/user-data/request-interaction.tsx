"use client"

import { Check, X } from "lucide-react";
import { useRequest } from "@/features/websocket/request-context";
import { Request, User } from "@/lib/types";
import { ListType, RequestState } from "@/lib/enums";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type RequestInteractionProps = {
  myUserId: number,
  user: User,
  request?: Request,
  listType: ListType
}

export default function RequestInteraction({user, listType, myUserId}: RequestInteractionProps) {
  const { sendRequest, friendRequests, gameRequests } = useRequest();
  const [thisRequest, setThisRequest] = useState<Request>();

  useEffect(() => {
    const shouldDisplay = [ListType.friends, ListType.incomingFriendRequests].includes(listType);
  
    if(shouldDisplay) setThisRequest(getRequest);

  }, [friendRequests, gameRequests])

  function getRequest() {
    let tmpRequests;

    if(listType === ListType.friends) tmpRequests = gameRequests;
    else if(listType === ListType.incomingFriendRequests) tmpRequests = friendRequests;

    return tmpRequests?.find(request => request.senderId === user.id);
  };

  function changeRequestState(newState: RequestState) {
    if(thisRequest) sendRequest({...thisRequest, state: newState}, listType === ListType.friends);
  };

  return ( myUserId === thisRequest?.receiverId && thisRequest.state === RequestState.Pending &&
    <div className="flex gap-1">
      <Button size="sm" onClick={(e) => (e.stopPropagation(), changeRequestState(RequestState.Accepted))}><Check/></Button>
      <Button size="sm" onClick={(e) => (e.stopPropagation(), changeRequestState(RequestState.Rejected))}><X/></Button>
    </div>
  );
}