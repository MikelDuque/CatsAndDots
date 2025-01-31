"use server"
import { cookies } from "next/headers";
import { cache } from "react";
import { jwtDecode, } from "jwt-decode";

type decodedToken = {
  id: number,
  unique_name: string,
  email: string,
  role: string,
  avatar: string,
  exp: number,
}

export const getAuth = cache(async () => {
  const cookieStore = await cookies();

  const authToken = cookieStore.get("authToken")?.value ?? null;
  const decodedToken = authToken ? jwtDecode<decodedToken>(authToken) : null;

  if (!authToken) {
    return {
      token:null,
      decodedToken:null
    };
  }

  return {
    token: authToken,
    decodedToken: decodedToken
  };
});