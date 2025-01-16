import Image from "next/image";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/theme/theme-switcher";

export default function Section01() {
  return(
    <section>
      <ThemeSwitcher/>
      <p className="hola">holaaaaa</p>
      <h1 className="title-day">Titulo</h1>
      Que tal
      <Image src={""} alt="Logo"/>
        <Button>Play now!</Button>
      <Image src={""} alt="Gameplay de muestra"/>
    </section>
  );
};