import Header from "../Header";
import InfoCard from "../infoCard";

function Section03() {
  return (
    <section className="h-screen  flex flex-col items-center  text-center">
      <Header />
      <div className="flex items-center h-screen gap-20">
        <InfoCard
        infoTitle="Conecta segmentos"
          path="/place_holders/gato.jpg"
          text="Conecta las intercecciones entre dos puntos para crear una linea de tu color,
          luego sera turno de tu rival y asi susesibamente."
        />
        <InfoCard
        infoTitle="Crea Gatos"
          path="/place_holders/gato.jpg"
          text="se el ultimo en cerrar un cuadro para crear un gato dentro del mismo y declararlo tuyo, si
          creas un gato tendras un turno extra."
        />
        <InfoCard
        infoTitle="Gana puntos"
          path="/place_holders/gato.jpg"
          text="Cada gato que creas se sumara a tu puntuacion un gato es un punto a tu favor, se el jugador 
          con mas puntaje para ganar el juego."
        />
      </div>

    </section>
  )
}

export default Section03;