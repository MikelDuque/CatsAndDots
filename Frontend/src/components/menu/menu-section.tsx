"use client"

import { Button } from "../ui/button";
import Title from "../utils/title";

export default function MenuSection() {
  return (
    <section className="w-full flex">
      <div className="w-1/2 bg-red-500">Contra Bots</div>
      <div className="w-1/2 bg-blue-500">Contra Otros</div>
    </section>
  );
};