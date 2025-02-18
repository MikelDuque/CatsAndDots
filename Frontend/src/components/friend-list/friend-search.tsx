import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useFetch from "@/features/endpoints/useFetch";
import { useAuth } from "@/features/auth/auth-context";
import { GET_PENDING_FRIENDS } from "@/features/endpoints/endpoints";
import { User } from "@/lib/types";
import { useEffect, useState } from "react";

type PendingFriends = {
  received: Set<User>,
  sent: Set<User>
}

export default function FriendSearch() {
  const { token, decodedToken } = useAuth();
  const { fetchData } = useFetch({ url: GET_PENDING_FRIENDS(decodedToken?.id || 0), type: "GET", token: token, needAuth: true, condition: !!token });

  const [pendingFriends, setPendingFriends] = useState<PendingFriends>({received: new Set(), sent: new Set()});

  useEffect(() => {
    if (fetchData) {
      const backPendingFriends = fetchData as PendingFriends
      
      setPendingFriends({
        received: backPendingFriends.received,
        sent: backPendingFriends.sent
      })
    };

  }, [fetchData]);

  return (
    <form className="flex w-full gap-1">
      <Input
        name="friendSearch"
        type="text"
        placeholder="Buscar amigos"
      />
      <Button type="submit" size="icon" variant="ghost"><Search /></Button>
    </form>
  );
};