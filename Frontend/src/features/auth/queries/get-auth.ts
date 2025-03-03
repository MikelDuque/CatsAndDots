"use server"

import { cookies } from "next/headers";
import { cache } from "react";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/lib/types";

export const getAuth = cache(async () => {
  const cookieStore = await cookies();

  const authToken = cookieStore.get("authToken")?.value;
  const decodedToken = authToken ? jwtDecode<DecodedToken>(authToken) : undefined;

  return {
    token: authToken,
    decodedToken: decodedToken
  };
});