import { useEffect, useState } from "react";
import Title from "../utils/title";
import { getAuth } from "@/features/auth/queries/get-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BASE_HTTPS_URL, GET_FRIENDLIST } from "@/features/endpoints/endpoints";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import FriendCard from "../friend-list/friend-card";
import { ConnectionState, User } from "@/lib/types";
import { useWebsocket } from "@/features/websocket/websocket-context";
import useFetch from "@/features/endpoints/useFetch";
import { useAuth } from "@/features/auth/auth-context";

type Player = {
  name: string | undefined;
  avatar: string | null;
} | null;


export default function Matchmaking({ onBack }: { onBack: () => void }) {
  const [players, setPlayers] = useState<Player[]>([null, null]);
  const [showFriendsModal, setShowFriendsModal] = useState(false)
  const [friendList, setFriendlist] = useState<Array<User>>([]);
  const { messages, sendMessage } = useWebsocket();
  const {token, decodedToken} = useAuth();
  const {fetchData} = useFetch({url: GET_FRIENDLIST(decodedToken?.id || 0), type: "GET", token: token, needAuth: true, condition: !!token});

  useEffect(() => {
    const user = messages ? messages["UserData"] as User : undefined;
    setFriendlist(previousState => previousState.map(friend => {
      console.log("user", user); console.log("friend", friend);

      return friend.id === user?.id ? user : friend
    }));

  }, [messages]);

  useEffect(() => {
    if(fetchData) setFriendlist(fetchData as Array<User>);
  }, [fetchData]);

  useEffect(() => {
    async function fetchUser() {
      const { decodedToken } = await getAuth();
      const user: Player = {
        name: decodedToken?.unique_name,
        avatar: `${BASE_HTTPS_URL}${decodedToken?.avatar}`,
      };
      setPlayers([user, null]);
    }

    fetchUser();
  }, []);

  useEffect(() => {
    if (!messages || typeof messages !== "object") return;
  
    const matchStartedMessage = messages["MatchStarted"];
  
      const role = matchStartedMessage.role
      const opponentId = matchStartedMessage.opponentId
      
      console.log("el rival", role, opponentId)
      if (role === "Host") {
        const opponent = friendList.find(friend => friend.id === opponentId);
        
        if (opponent) {
          const opponentPlayer: Player = {
            name: opponent.username,
            avatar: opponent.avatar ? `${BASE_HTTPS_URL}${opponent.avatar}` : null,
          };
  
          setPlayers(prevPlayers => [prevPlayers[0], opponentPlayer]);
        }
      }
    
  }, [messages, friendList]);



  return (
    <section className="flex justify-around items-center size-full relative">
      <Button variant="ghost" size="icon" className="absolute left-4 top-4" onClick={onBack}>
        <ChevronLeft />
      </Button>
      {players.map((player, index) => (
        console.log("nombre", player?.name),
        <>
          <div key={index} className="relative">
            {player ? (
              <Avatar className="w-48 h-48 ">
                <AvatarImage src={player.avatar || undefined} alt={player.name} />
                <AvatarFallback delayMs={600} className="title">
                  {player.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <span className="title w-48 h-48 bg-black/50 text-white flex items-center justify-center rounded-full cursor-pointer "
                onClick={() => setShowFriendsModal(true)}>
                ➕
              </span>
            )}
            <Title moreClasses="absolute left-1/2 -bottom-10 -translate-x-1/2 text-4xl">{player?.name}</Title>
          </div>
          {index === 0 && <span className="super-title">VS</span>}
        </>
      ))}
      <Button className="absolute bottom-20">Empezar Partida</Button>

      <Dialog open={showFriendsModal} onOpenChange={setShowFriendsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle> Invita un amigo</DialogTitle>
          </DialogHeader>
          <div>
            <ul className="text-body grid gap-1">
            <ListMapper list={friendList} sendMessage={sendMessage} />
            </ul>

          </div>
        </DialogContent>
      </Dialog>

    </section>
  );

}

function ListMapper({ list, sendMessage }: { list: Array<User>, sendMessage: (message: any) => void }) {
  return list.length > 0 ? (
    list.map((user) => (user.connectionState === ConnectionState.Online &&
      <li key={user.id} className="flex items-center justify-around">
        <FriendCard user={user} />
        <Button onClick={() => inviteFriend(user.id, sendMessage)}>
          ✔
        </Button>
      </li>
    ))
  ) : <p className="body-text">No hay amigos disponibles para invitar</p>;
}


function inviteFriend(friendId: number, sendMessage: (message: any) => void) {
  sendMessage({
    MessageType: "MatchmakingMessage",
    Body: {
      Action: "InviteFriend",
      GuestId: friendId
    }
  });
}