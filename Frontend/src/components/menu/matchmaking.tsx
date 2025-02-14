import { useEffect, useState } from "react";
import Title from "../utils/title";
import { getAuth } from "@/features/auth/queries/get-auth";
import { DecodedToken } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BASE_HTTPS_URL } from "@/features/endpoints/endpoints";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

type Player = {
  name: string | undefined;
  avatar: string | null;
} | null;

export default function Matchmaking({ onBack }: { onBack: () => void }) {
  const [players, setPlayers] = useState<Player[]>([null, null]);

  useEffect(() => {
    async function fetchUser() {
      const { decodedToken } = await getAuth();
      const user: Player = {
        name: decodedToken?.unique_name,
        avatar: `${BASE_HTTPS_URL}${decodedToken?.avatar}`,
      };
      setPlayers([user, null]); // Guardamos al primer jugador en el array
    }

    fetchUser();
  }, []);

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
              <Avatar className="w-48 h-48">
                <AvatarImage src={player.avatar || undefined} alt={player.name} />
                <AvatarFallback delayMs={600} className="title">
                  {player.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <span className="super-title w-48 h-48 bg-gray-700 text-white flex items-center justify-center rounded-full">
                +
              </span>
            )}
            <Title moreClasses="absolute left-1/2 -bottom-10 -translate-x-1/2 text-4xl">{player?.name}</Title>
          </div>
          {index === 0 && <span className="super-title">VS</span>}
          </>
        ))}
    </section>
  );
}
