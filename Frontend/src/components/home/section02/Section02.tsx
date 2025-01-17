import Image from "next/image";
import Header from "../Header";

function Section02() {
  return (
    <section className="h-screen flex flex-col items-center ">
      <Header/>

      <h1 className=" mb-7 mt-20 title">¿En qué consiste?</h1>

      <div className="flex items-center justify-center space-x-8">
        <Image
          className=" rotate-30"
          src="/gato_celeste.png"
          width={100}
          alt="Gato blanco"
          height={100}
        />

        <p className="max-w-lg text-body">
          Puntos y Cajas es un juego de estrategia en el que los jugadores toman turnos para dibujar líneas 
          entre puntos en una cuadrícula. El objetivo principal es completar más cuadrados que el oponente 
          al cerrar los lados de los cuadrados uno por uno. Cada vez que un jugador completa un cuadrado, 
          lo reclama como suyo y obtiene un turno adicional. Al final del juego, gana el jugador que haya reclamado 
          más cuadrados.
        </p>

        <Image
          className=" -rotate-30"
          src="/gato_marron.png"
          alt="Gato naranja"
          width={100}
          height={100}
        />
      </div>
    </section>
  );
}

export default Section02;
