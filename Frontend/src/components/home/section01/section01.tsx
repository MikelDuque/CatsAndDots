import Image from "next/image";
import StartButton from "../startButton";
import { gameTitle, text, titlesDay } from "@/lib/fonts";

export default function Section01() {
  return(
    <section className="title">
      holaaaaaaa
      Que tal
      <Image src={""} alt="Logo"/>
        <StartButton/>
      <Image src={""} alt="Gameplay de muestra"/>
    </section>
  );
};