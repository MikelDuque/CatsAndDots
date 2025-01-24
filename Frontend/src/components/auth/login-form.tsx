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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Title from "../utils/title";
import { LoginAction } from "@/features/auth/actions/server-actions";
import { useActionState } from "react";
import { Input } from "../ui/input";

interface LoginFormInputs {
  identifier: string;
  password: string;
}

export default function LoginForm() {
  const [loginActionState, loginAction] = useActionState(LoginAction, {
    message: "",
    fieldErrors: {},
  });

  const form = useForm<LoginFormInputs>({
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onSubmit",
  });

 

  return (
    <Card className="w-1/4 h-fit">

      <CardHeader>
        <CardTitle><Title>Inicia Sesión</Title></CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-5 text-body text-left" action={loginAction}>

            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de Usuario o Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Introduce tu usuario o correo"
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
                    <Input
                      type="password"
                      placeholder="Introduce tu contraseña"
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
          ¿No tienes cuenta?
          <Button variant="link" >¡Regístrate!</Button>
        </p> 
      </CardFooter>
    </Card>
  );
}
