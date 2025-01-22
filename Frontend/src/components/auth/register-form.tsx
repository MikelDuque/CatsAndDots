import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "../ui/form";
import { FormInput } from "lucide-react";
import Title from "../utils/title";
import { useForm } from "react-hook-form";
import fetchEndpoint from "@/features/auth/queries/fetch-endpoint";
import { REGISTER_URL } from "@/lib/endpoints";


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

          </form>
        </Form>
      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>
  )
}