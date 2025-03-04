"use client";

import { useEffect, useState } from "react";
import { useWebsocket } from "@/features/websocket/websocket-context";
import { getAuth } from "@/features/auth/queries/get-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BASE_HTTPS_URL } from "@/features/endpoints/endpoints";

type Player = {
  name: string;
  avatar: string | null;
  score: number;
};

export default function Gameplay() {
  const { messages, sendMessage } = useWebsocket();
  const [players, setPlayers] = useState<Player[]>([
    { name: "Jugador", avatar: null, score: 0 },
    { name: "Bot", avatar: null, score: 0 },
  ]);

  const [board, setBoard] = useState<string[][]>(
    Array.from({ length: 5 }, () => Array(5).fill(null))
  );

  useEffect(() => {
    if (messages?.MoveConfirmed) {
      const { num1, num2, jugador } = messages.MoveConfirmed as {
        tipoLinea?: number; num1: number; num2: number; jugador: string;
      };

      if (num1 >= 0 && num1 < 5 && num2 >= 0 && num2 < 5) {
        setBoard((prevBoard) => {
          const newBoard = prevBoard.map(row => [...row]);
          newBoard[num1][num2] = jugador;
          return newBoard;
        });
      }
    }
  }, [messages]);


  useEffect(() => {
    async function fetchUser() {
      const { decodedToken } = await getAuth();
      const user: Player = {
        name: decodedToken?.unique_name || "Jugador",
        avatar: decodedToken?.avatar ? `${BASE_HTTPS_URL}${decodedToken.avatar}` : null,
        score: 0,
      };
      setPlayers((prev) => [user, prev[1]]);
    }

    fetchUser();
  }, []);

  const handleMove = (tipoLinea: number, num1: number, num2: number) => {
    sendMessage({
      MessageType: "PlayerMove",
      TipoLinea: tipoLinea,
      Num1: num1,
      Num2: num2,
    });
  };

  return (
    <section className="flex flex-col items-center h-full w-full">
      <div className="flex justify-between items-center w-3/4 p-4">
        {players.map((player, index) => (
          <div key={index} className="flex flex-col items-center relative">
            <Avatar className="w-32 h-32">
              <AvatarImage src={player.avatar || undefined} alt={player.name} />
              <AvatarFallback>{player.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h2 className="super-title">{player.name}</h2>
            <span className="absolute top-0 right-0 bg-blue-500 text-white text-xl font-bold px-3 py-1 rounded-full">
              {player.score}
            </span>
          </div>
        ))}
      </div>

      <div className="grid">
  {[...Array(6)].map((_, rowIdx) => (
    <div key={rowIdx} className="flex flex-col">
      <div className="flex items-center">
        {[...Array(6)].map((_, colIdx) => (
          <div key={colIdx} className="flex items-center">
            <div className="w-4 h-4 bg-black rounded-full"></div>

            {colIdx < 5 && (
              <div
                className={`w-12 h-1 ${
                  board[rowIdx]?.[colIdx] ? "bg-blue-500" : "bg-transparent"
                } cursor-pointer`}
                onClick={() => handleMove(1, rowIdx, colIdx)}
              ></div>
            )}
          </div>
        ))}
      </div>

      {rowIdx < 5 && (
        <div className="flex">
          {[...Array(6)].map((_, colIdx) => (
            <div key={colIdx} className="flex">
              {colIdx < 5 && (
                <div className="w-4 flex justify-center">
                  <div
                    className={`h-12 w-1 ${
                      board[rowIdx]?.[colIdx] ? "bg-blue-500" : "bg-transparent"
                    } cursor-pointer`}
                    onClick={() => handleMove(2, rowIdx, colIdx)}
                  ></div>
                </div>
              )}
              {colIdx < 5 && <div className="w-12 h-12"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  ))}
</div>

    </section>
  );
}
