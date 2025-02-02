"use client"

import { Button } from "../ui/button";
import Title from "../utils/title";

export default function MenuSection() {
  return (
    <section className="size-full">
      <Button className="ml-[200] shadow-md shadow-slate-700 " >
        <Title moreClasses="text-4xl">Buscar Partida</Title>
      </Button>
      <Button variant="default" size="icon" className="fixed top-20 left-5">
          🔎
        </Button>
    </section>
  );
};