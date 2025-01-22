"use server"
import { ActionState } from "../types";
import fetchEndpoint from "../queries/fetch-endpoint";
import { redirect } from "next/navigation";
import { home, menu } from "@/lib/paths";
import { LOGIN_URL } from "@/lib/endpoints";

export async function LoginAction(_actionState: ActionState, formData: FormData): Promise<ActionState> {
    
  console.log("Datos del formulario:", formData);

  const data = {identifier:formData.get("identifier"), password:formData.get("password")};
  
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //esto hay que invesitgarlo (rocio y mikel y las dos IAs (van a ser las protas))
    const response = await fetchEndpoint({
      url: "https://localhost:7252/api/Auth/Login", //falla la variable de entorno (mikel sabe y la IA tambien (pero no tanto))
      type: "POST",
      token: null,
      params: data,
    });
    console.log("respuesta",response)
  } catch (error) {
    console.log("HOlaaaaa",error);
    
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Algo falló inesperadamente",
      payload: formData,
      fieldErrors: {},
    };
  }
  console.log("Nos vamos");
  
  redirect(menu);
};