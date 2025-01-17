import paso1 from "@/../public/Home/place_holders/gato.jpg"
import InfoCard from "./infoCard";

function Section03() {
  return (
    <section className="h-screen flex gap-20 items-center justify-center">
        <InfoCard title="Conecta segmentos" img={paso1}>
          Conecta las intersecciones entre dos puntos para crear una linea de tu color. Seguidamente, será el turno de tu rival, y así sucesivamente.
        </InfoCard>
        <InfoCard title="Crea Gatos" img={paso1}>
          Sé el último en cerrar un cuadro para crear un gato dentro del mismo, y declararlo como tuyo. ¡Al hacerlo, ganarás un turno extra!
        </InfoCard>
        <InfoCard title="Gana puntos" img={paso1}>
          Por cada gato que crees, sumarás 1 punto a tu puntuación. ¡Monta tu estrategia y encadena "gatos" para alzarte con la victoria!
        </InfoCard>
    </section>
  )
}

export default Section03;