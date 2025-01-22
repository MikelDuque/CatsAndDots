import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "../ui/form";
import { FormInput } from "lucide-react";

export default function Register() {
  return(
    <Card>
      <CardHeader>
        <CardTitle>Inicia Sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <Form>
          <FormInput>
            
          </FormInput>
        </Form>
      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>
  )
}