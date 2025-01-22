"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import fetchEndpoint from "@/features/auth/queries/fetch-endpoint";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Title from "../utils/title";

interface LoginFormInputs {
  identifier: string;
  password: string;
}

export default function LoginForm() {
  const form = useForm<LoginFormInputs>({
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginFormInputs) => {
    console.log("Datos del formulario:", data);
    try {
      const response = await fetchEndpoint({
        url: "https://localhost:7252/api/Auth/Login",
        type: "POST",
        token: null,
        params: data,
      });

      console.log("Inicio de sesión exitoso:", response);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <Card className="w-1/4 h-fit">

      <CardHeader>
        <CardTitle><Title>Inicia Sesión</Title></CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-5 text-body text-left" onSubmit={form.handleSubmit(onSubmit)}>

            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de Usuario o Correo Electrónico</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="Introduce tu usuario o correo"
                      className="w-full px-4 py-2 border rounded-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <input
                      type="password"
                      placeholder="Introduce tu contraseña"
                      className="w-full px-4 py-2 border rounded-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter>
        <p className="text-body">
          ¿Aún no tienes cuenta?
          <Button variant="link" >¡Regístrate!</Button>
        </p> 
      </CardFooter>
    </Card>
  );
}
