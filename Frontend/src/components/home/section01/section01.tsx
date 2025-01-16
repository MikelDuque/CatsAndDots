import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Section01() {
  return(
    <section className="h-screen">
      <Image src={"/logo.png"} alt="Logo" width={700} height={700}/>
        <Button>Play now!</Button>
      <Image src={""} alt="Gameplay de muestra"/>
    </section>
  );
};