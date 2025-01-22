"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import fetchEndpoint from "@/features/auth/queries/fetchEndpoint";

interface LoginFormInputs {
  username: string;
  password: string;
}

export default function LoginForm() {
  const form = useForm<LoginFormInputs>({
    defaultValues: {
      username: "",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
       
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de Usuario o Correo Electrónico</FormLabel>
              <FormControl>
                <input
                  type="text"
                  placeholder="Introduce tu nombre de usuario o correo"
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
  );
}
