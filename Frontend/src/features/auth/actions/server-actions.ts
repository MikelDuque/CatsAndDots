"use server"

import { ActionState } from "../types";
import fetchEndpoint from "../queries/fetch-endpoint";
import { redirect } from "next/navigation";
import { menuPath } from "@/lib/paths";
import { LOGIN_URL, REGISTER_URL } from "@/lib/endpoints";
import { ZodError } from "zod";
import { formSchema } from "../queries/form-validator";
import { cookies } from "next/headers";

export async function LoginAction(_actionState: ActionState, formData: FormData) : Promise<ActionState> {
  const loginRequest = {
    identifier:formData.get("identifier"),
    password:formData.get("password")
  };
  
  try {
    const response = await fetchEndpoint({
      url: LOGIN_URL,
      type: "POST",
      token: null,
      params: loginRequest
    });
   
    saveAuthToken(response.accessToken);

  } catch (error) {
    return {
      status: "PROMISE-ERROR",
      message: error? error.toString() : "Algo falló inesperadamente",
      payload: formData,
      fieldErrors: {},
    };
  };
  
  redirect(menuPath);
};

export async function RegisterAction(_actionState: ActionState, formData: FormData) : Promise<ActionState> {
  const formAvatar = formData.get("avatar");
  
  const registerRequest = new FormData;
    registerRequest.append('username', formData.get("username") as string);
    registerRequest.append('mail', formData.get("mail") as string);
    registerRequest.append('password', formData.get("password") as string);
    if(formAvatar?.size >= 0) registerRequest.append('avatar', formData.get("avatar") as File);

  try {
    formSchema.parse(Object.fromEntries(formData));
    
    const response = await fetchEndpoint({
      url: REGISTER_URL,
      type: 'POST',
      token: null,
      params: registerRequest
    });
    console.log("respuest registro", response);
    
    saveAuthToken(response.accessToken);

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