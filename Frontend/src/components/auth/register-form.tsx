import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import Title from "../utils/title";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useActionState, useEffect } from "react";
import { RegisterAction } from "@/features/auth/actions/server-actions";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { formSchema } from "@/features/auth/queries/form-validator";


type RegisterFormInputs = {
  username: string;
  mail: string;
  password: string;
  confirmPassword: string;
  avatar: File;
}

type RegisterFormProps = {
  onSwitchToLogin: () => void;
};

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [registerActionState, registerAction] = useActionState(RegisterAction, {
      message: "",
      fieldErrors: {},
    });

    useEffect(() => {
      switch (registerActionState.status) {
        case "SUCCESS":
          toast.success(registerActionState.message)
          break;
        case "PROMISE-ERROR":
          toast.error(registerActionState.message)
      }
    }, [registerActionState])

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: "",
        mail: "",
        password: "",
        confirmPassword: "",
        avatar: undefined
      },
      mode: "onSubmit"
    });

  return(
    <Card className="w-1/3 h-fit">
      <CardHeader>
        <CardTitle><Title>Regístrate</Title></CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-5 text-body text-left" action={registerAction}>

            <FormField
              name="username"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Nombre de Usuario</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Introduce tu nombre de usuario"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{registerActionState.fieldErrors["username"]?.[0]}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="mail"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Introduce tu correo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{registerActionState.fieldErrors["mail"]?.[0]}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Introduce tu contraseña"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{registerActionState.fieldErrors["password"]?.[0]}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="confirmPassword"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Confirmación de Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Repita la contraseña"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{registerActionState.fieldErrors["confirmPassword"]?.[0]}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="avatar"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormDescription>Puede añadir a continuación una avatar personalizado</FormDescription>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      placeholder="Seleccione una imagen"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{registerActionState.fieldErrors["avatar"]?.[0]}</FormMessage>
                </FormItem>
              )}
            />

            <Button size="lg">
              Regístrate
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter>
        <p className="text-body">
          ¿Ya tienes cuenta?
          <Button variant="link" onClick={onSwitchToLogin}>Inicia Sesión</Button>
        </p>
      </CardFooter>
    </Card>
  )
}