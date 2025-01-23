import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import Title from "../utils/title";
import { useForm } from "react-hook-form";
import fetchEndpoint from "@/features/auth/queries/fetch-endpoint";
import { REGISTER_URL } from "@/lib/endpoints";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


type RegisterFormInputs = {
  username: string;
  mail: string;
  password: string;
  confirmPassword: string;
  avatar: File;
}

export default function RegisterForm() {
  const form = useForm<RegisterFormInputs>({
      defaultValues: {
        username: "",
        mail: "",
        password: "",
        confirmPassword: "",
        avatar: undefined
      },
      mode: "onSubmit",
    });

     async function onSubmit (data: RegisterFormInputs) {
        console.log("Datos del formulario:", data);
        try {
          const response = await fetchEndpoint({
            url: REGISTER_URL,
            type: "POST",
            token: null,
            params: data,
          });
    
          console.log("Inicio de sesión exitoso:", response);
        } catch (error) {
          console.error("Error al iniciar sesión:", error);
        }
      };

  return(
    <Card className="w-1/3 h-fit">
      <CardHeader>
        <CardTitle><Title>Regístrate</Title></CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-5 text-body text-left" onSubmit={form.handleSubmit(onSubmit)}>

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
                  <FormMessage/>
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
                  <FormMessage/>
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
                  <FormMessage/>
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
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              name="avatar"
              control={form.control}
              render={() => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormDescription>Puede añadir a continuación una avatar personalizado</FormDescription>
                  <FormControl>
                    <Input type="file"/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <Button type="submit" size="lg">
              Regístrate
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter>
        <p className="text-body">
          ¿Ya tienes cuenta?
          <Button variant="link" >Inicia Sesión</Button>
        </p>
      </CardFooter>
    </Card>
  )
}