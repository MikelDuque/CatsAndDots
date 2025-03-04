# Cats And Dots
## Contenedor de código reutilizable (Frontend)

### FriendList modificada por Fernando
```
export default function FriendList() {
  const { token, decodedToken } = useAuth();
  const { messages, sendMessage } = useWebsocket();

  const { fetchData } = useFetch({ url: GET_FRIEND_LIST(decodedToken?.id || 0), type: "GET", token: token, needAuth: true, condition: !!token });

  const [hideFriends, setHideFriendlist] = useState(false);
  const [friendList, setFriendlist] = useState<Array<User>>([]);
  const [pendingInvitations, setPendingInvitations] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (fetchData) setFriendlist(fetchData as Array<User>);
  }, [fetchData]);

  useEffect(() => {
    if(!messages) return;

    const user = messages["UserData"] as User;

    setFriendlist(previousState => {
      const exists = previousState.some(friend => friend.id === user.id);

      if(!exists) return [...previousState, user];

      return previousState.map(friend => {
        return friend?.id === user?.id ? user : friend
      });
    });
    
  }, [messages]);

  useEffect(() => {
    if (!messages || typeof messages !== "object") return; 
    const invitationMessage = (messages as Record<string, any>)["GameInvitation"];
  
    if (invitationMessage && typeof invitationMessage === "object") {
      const senderId = invitationMessage["senderId"];
      const recipientId = decodedToken?.id;
  
      if (typeof senderId === "number" && recipientId !== senderId) {
        setPendingInvitations(prev => ({
          ...prev,
          [senderId]: true 
        }));
      }
    }
  
  }, [messages]);


  function acceptInvitation(hostId: number) {
    sendMessage({
      MessageType: "MatchmakingMessage",
      Body: {
        Action: "AcceptInvitation",
        HostId: hostId,
        GuestId: decodedToken?.id
      }
    });

    setPendingInvitations(prev => {
      const updatedInvitations = { ...prev };
      delete updatedInvitations[hostId];
      return  { ...updatedInvitations };
    });
  }

  function rejectInvitation(hostId: number) {
    sendMessage({
      MessageType: "MatchmakingMessage",
      Body: {
        Action: "RejectInvitation",
        HostId: hostId,
        GuestId: decodedToken?.id
      }
    });

    setPendingInvitations(prev => {
      const updatedInvitations = { ...prev };
      delete updatedInvitations[hostId]; 
      return updatedInvitations;
    });
  }


  function OnHide() { setHideFriendlist(previousState => !previousState) };

  return (
    <>
      {hideFriends &&
        <Button variant="ghost" onClick={OnHide} className={`absolute right-0 ${hideFriends ? "" : "hidden"}`}>
          <ChevronLeft /><Users />
        </Button >
      }

      <aside className={`p-2 flex flex-col min-w-1/5 max-w-1/4 h-full bg-secondary gap-5 ${hideFriends && "fixed right-full"}`}>
        <div className="flex justify-between">
          <Button variant="ghost" size="icon" onClick={OnHide}><ChevronRight /></Button >
          <Title moreClasses="w-full">Amigos</Title>
          <UserSearch />
        </div>

        <FriendSearch/>

        <ul className="text-body grid gap-1">
          {ListMapper(friendList, pendingInvitations, acceptInvitation, rejectInvitation)}
        </ul>
      </aside>
    </>
  );
};

function ListMapper(list: Array<User>,
  pendingInvitations: { [key: number]: boolean },
  acceptInvitation: (friendId: number) => void,
  rejectInvitation: (friendId: number) => void
) {
  return (list.length > 0 ? (
    list.map((user) => (
      <li key={user.id} className="cursor-pointer flex items-center gap-20">
        <FriendCard user={user} />

        {pendingInvitations[user.id] && (
          <div className="flex gap-5">
            <Button size="sm" onClick={() => acceptInvitation(user.id)}>✔</Button>
            <Button size="sm" onClick={() => rejectInvitation(user.id)}>✖</Button>
          </div>
        )}
      </li>
    ))) : <p className="body-text">No se ha podido cargar tus amigos</p>);
};
```

### FriendList antes usar customHook useFriendlist
```
const { token, decodedToken } = useAuth();
  const { messages } = useWebsocket();
  const { gameRequests } = useRequest();

  const { fetchData } = useFetch({ url: GET_FRIEND_LIST(decodedToken?.id || 0), type: "GET", token: token, needAuth: true, condition: !!token });

  const [hideFriends, setHideFriendlist] = useState(false);
  const [friendList, setFriendlist] = useState<User[]>([]);

  useEffect(() => {
    if (fetchData) setFriendlist(fetchData as User[]);
  }, [fetchData]);

  useEffect(() => {
    if(!messages) return;

    const user = messages["UserData"] as User;

    setFriendlist(previousState => {
      const exists = previousState.some(friend => friend.id === user.id);
      if(!exists) return [...previousState, user];

      return previousState.map(friend => {
        return friend?.id === user?.id ? user : friend
      });
    });
    
  }, [messages]);
```

### Eliminar requests como diccionarios
```
setFriendRequests(prevState => {
  const newState = { ...prevState };
  delete newState[request.senderId];
  return newState;
});
```

### HandleRequest antes de refactorizarlo
```
function handleRequest(request: Request, isGameRequest: boolean) {
  switch (request.state) {
    case RequestState.Pending:
      if(isGameRequest) {
        setGameRequests(prevState => ({
          ...prevState,
          request
        }));
      } else {
        setFriendRequests(prevState => ({
          ...prevState,
          request
        }));
      };
      break;

    case RequestState.Accepted:
    case RequestState.Rejected:
      sendRequest(request, isGameRequest);

      if(isGameRequest) {
        setGameRequests(prevState => {
          return [...prevState].filter((thisRequest) => thisRequest.senderId !== request.senderId);
        });
      } else {
        setFriendRequests(prevState => {
          return [...prevState].filter((thisRequest) => thisRequest.senderId !== request.senderId);
        });
      }
      break;
  };
}
```

### Matchmaking Fernando
```
useEffect(() => {
  const thisGameRequest = gameRequests[players.Host.id];

  if (thisGameRequest && thisGameRequest.state === RequestState.Accepted) {
    const guest = friendList.find(friend => friend.id === thisGameRequest.receiverId);

    if(!guest) return;

    setPlayers(prevState => ({
      ...prevState,
      Guest: {
        id: guest.id || 0,
        userName: guest.username,
        avatar: guest.avatar,
      }
    }));
  };

  if (!messages || typeof messages !== "object") return;

  const matchStartedMessage = messages["MatchStarted"];

    const role = matchStartedMessage?.role || null;
    const opponentId = matchStartedMessage?.opponentId || 0;
    
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
```