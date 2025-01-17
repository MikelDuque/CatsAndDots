import Image from "next/image";
  import gatoNaranja from '@/../public/Home/gato_naranja.png'
  import gatoCeleste from '@/../public/Home/gato_celeste.png'
import Title from "../utils/title";

function Section02() {
  return (
    <section className="h-screen flex flex-col gap-20 justify-center snap-start">

      <Title moreClasses="text-6xl">¿En qué consiste?</Title>

      <div className="flex justify-center gap-x-24">
        <figure>
          <Image
            className="rotate-30"
            src={gatoCeleste}
            alt="Gato blanco"
          />
        </figure>

        <p className="max-w-2xl text-body text-2xl">
          Puntos y Cajas es un juego de estrategia en el que los jugadores toman turnos para dibujar líneas 
          entre puntos en una cuadrícula.El objetivo principal es completar más cuadrados que el oponente 
          al cerrar los lados de los cuadrados uno por uno. Cada vez que un jugador completa un cuadrado, 
          lo reclama como suyo y obtiene un turno adicional. Al final del juego, gana el jugador que haya reclamado 
          más cuadrados.
        </p>

        <figure>
          <Image
            className="-rotate-30"
            src={gatoNaranja}
            alt="Gato naranja"
          />
        </figure>
      </div>
    </section>
  );
}

export default Section02;
