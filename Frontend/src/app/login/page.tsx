import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

export default function Login() {
  return (
    <>
    <header>
      <Button variant="ghost" size="icon"><ChevronLeft/></Button>
    </header>
    <main>
      <Card>
        <CardHeader>
          <CardTitle>Inicia Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          Formulario
        </CardContent>
      </Card>
    </main>
    </>
  );
}