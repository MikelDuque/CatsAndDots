import InfoCard from "./infoCard";
import Title from "../utils/title";

function Section03() {
  return (
    <section className="h-screen flex flex-col gap-12 justify-center snap-start">
      <Title moreClasses="text-5xl">¿Cómo jugar?</Title>
      <div className="flex gap-20 justify-center snap-start">
        <InfoCard title="Conecta segmentos" img={"/Home/place_holders/gato.jpg"}>
          Conecta las intersecciones entre dos puntos para crear una linea de tu color. Seguidamente, será el turno de tu rival.
        </InfoCard>
        <InfoCard title="Crea Gatos" img={"/Home/place_holders/gato.jpg"}>
          Sé el último en cerrar un cuadro para crear un gato dentro del mismo, y declararlo como tuyo. ¡Al hacerlo, ganarás un turno extra!
        </InfoCard>
        <InfoCard title="Gana puntos" img={"/Home/place_holders/gato.jpg"}>
          Por cada gato que crees, sumarás 1 punto a tu puntuación. ¡Monta tu estrategia y encadena &quot;gatos&quot; para alzarte con la victoria!
        </InfoCard>
      </div>
    </section>
  )
}

export default Section03;