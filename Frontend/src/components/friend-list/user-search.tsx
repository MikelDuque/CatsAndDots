"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import Title from "../utils/title";

export default function UserSearch() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><UserPlus /></Button>
      </DialogTrigger>
      <DialogContent className="bg-popover">
        <DialogHeader>
          <DialogTitle><Title>Búsqueda de Usuarios</Title></DialogTitle>
        </DialogHeader>
        CONTENIDO
      </DialogContent>
    </Dialog>
  );
}