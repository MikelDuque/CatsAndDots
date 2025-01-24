import { cookies } from "next/headers";
import { cache } from "react";
import { jwtDecode, } from "jwt-decode";

type decodedToken = {
  id: Number,
  unique_name: String,
  email: String,
  role: String,
  exp: Number,
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