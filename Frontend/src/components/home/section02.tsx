import Image from "next/image";
import Title from "../utils/title";

function Section02() {
  return (
    <section className="h-screen flex flex-col gap-20 justify-center snap-start">

      <Title moreClasses="text-6xl">¿En qué consiste?</Title>

      <div className="flex justify-center items-center gap-x-24">
        <Image
          src="/Home/gato_celeste.png"
          alt="Gato blanco"
          width={175}
          height={175}
          className="rotate-30"
        />

        <p className="max-w-2xl text-body text-2xl">
          Puntos y Cajas es un juego de estrategia en el que los jugadores toman turnos para dibujar líneas 
          entre puntos en una cuadrícula. El objetivo principal es completar más cuadrados que el oponente 
          al cerrar los lados de los cuadrados uno por uno. Cada vez que un jugador completa un cuadrado, 
          lo reclama como suyo y obtiene un turno adicional. Al final del juego, gana el jugador que haya reclamado 
          más cuadrados.
        </p>

        <Image
          src="/Home/gato_naranja.png"
          alt="Gato blanco"
          width={175}
          height={175}
          className="-rotate-30"
        />
      </div>
    </section>
  );
}

export default Section02;
