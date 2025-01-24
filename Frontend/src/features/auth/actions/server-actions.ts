"use server"

import { ActionState } from "../types";
import fetchEndpoint from "../queries/fetch-endpoint";
import { redirect } from "next/navigation";
import { menuPath } from "@/lib/paths";
import { LOGIN_URL, REGISTER_URL } from "@/lib/endpoints";
import { ZodError } from "zod";

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

  } catch (error) {
    return {
      status: "PROMISE-ERROR",
      message: error? error.toString() : "Algo falló inesperadamente",
      payload: formData,
      fieldErrors: {},
    };
  }
  
  redirect(menuPath);
};

export async function RegisterAction(_actionState: ActionState, formData: FormData) : Promise<ActionState> {
  const registerRequest = new FormData;
    registerRequest.append('username', formData.get("username") as string);
    registerRequest.append('mail', formData.get("email") as string);
    registerRequest.append('password', formData.get("password") as string);
    registerRequest.append('avatar', formData.get("avatar") as File);

  try {
    const response = fetchEndpoint({
      url: REGISTER_URL,
      type: 'POST',
      token: null,
      params: registerRequest
    });

  } catch (error) {
    return error instanceof ZodError ? {
      status: "FORM-ERROR",
      message: "Ha ocurrido un error al cumplimentar los datos de registro",
      payload: formData,
      fieldErrors: error.flatten().fieldErrors
    } : {
      status: "PROMISE-ERROR",
      message: error? error.toString() : "Algo falló inesperadamente",
      payload: formData,
      fieldErrors: {},
    };
  }

  redirect(menuPath);
}