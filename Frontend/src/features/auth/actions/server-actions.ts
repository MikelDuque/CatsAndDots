"use server"

import { ActionState } from "../../../lib/types";
import fetchEndpoint from "../../endpoints/fetch-endpoint";
import { redirect } from "next/navigation";
import { homePath, menuPath } from "@/lib/paths";
import { LOGIN_URL, REGISTER_URL } from "@/features/endpoints/endpoints";
import { ZodError } from "zod";
import { formSchema } from "../queries/form-validator";
import { cookies } from "next/headers";


export async function LoginAction(_actionState: ActionState, formData: FormData) : Promise<ActionState> {
 
  const loginRequest = {
    identifier: formData.get("identifier"),
    password: formData.get("password")
  };
  
  try {
    const response = await fetchEndpoint({
      url: LOGIN_URL,
      type: "POST",
      params: loginRequest
    });

    console.log("response login", response);
    
   
    await saveAuthToken(response.accessToken);

  } catch (error) {
    return {
      status: "PROMISE-ERROR",
      message: error? error.toString() : "Algo falló inesperadamente",
      payload: formData,
      fieldErrors: {},
    };
  };
  console.log("Redireccionando a menu")
  redirect(menuPath);
};

export async function RegisterAction(_actionState: ActionState, formData: FormData) : Promise<ActionState> {
  const formAvatar = formData.get("avatar");
  
  const registerRequest = new FormData;
    registerRequest.append('username', formData.get("username") as string);
    registerRequest.append('mail', formData.get("mail") as string);
    registerRequest.append('password', formData.get("password") as string);
    if(formAvatar instanceof File && formAvatar.size >= 0) registerRequest.append('avatar', formData.get("avatar") as File);

  try {
    formSchema.parse(Object.fromEntries(formData));
    
    const response = await fetchEndpoint({
      url: REGISTER_URL,
      type: 'POST',
      params: registerRequest
    });
    
    await saveAuthToken(response.accessToken);

  } catch (error) {
    return error instanceof ZodError ? {
      status: "FORM-ERROR",
      message: "Ha ocurrido un error al cumplimentar los datos de registro",
      payload: formData,
      fieldErrors: error.flatten().fieldErrors
    } : {
      status: "PROMISE-ERROR",
      message: error ? error.toString() : "Algo falló inesperadamente",
      payload: formData,
      fieldErrors: {},
    };
  }
  redirect(menuPath);
};

async function saveAuthToken(token: string) {
  const cookieStore = await cookies();
  
  cookieStore.set({
    name: "authToken",
    value: token,
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    path: "/", 
    maxAge: 60 * 60 * 24 * 7, 
  });
};

export async function LogOut() {
  
  const cookieStore = await cookies();

  cookieStore.delete('authToken');
  
  redirect(homePath);
}