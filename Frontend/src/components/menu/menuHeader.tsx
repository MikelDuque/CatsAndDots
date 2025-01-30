interface MenuHeaderProps {
  decodedToken: string | undefined;
}

export default function MenuHeader({ decodedToken }: MenuHeaderProps) {
  const conectedUsers = 1;
  const inMatchUsers = 0;
  const matchs = 0;
  return (
    <header className="flex justify-between p-4 bg-secondary">
      <section className="flex gap-12">
        <div>
          Usuarios conectados: {conectedUsers}
        </div>
        <div>
          Usuarios en partida: {inMatchUsers}
        </div>
        <div>
          Partidas en curso: {matchs}
        </div>
      </section>
      <section>
        Hola {decodedToken}
      </section>

    </header>
  )
}
