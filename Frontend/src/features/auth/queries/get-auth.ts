import { cookies } from "next/headers";
import { cache } from "react";
import { jwtDecode } from "jwt-decode";

export const getAuth = cache(async () => {
  const cookieStore = await cookies();

  const authToken = cookieStore.get("authToken")?.value ?? null;
  const decodedToken = authToken ? jwtDecode(authToken) : null;

  if (!authToken) {
    return {
      user: null,
      session: null,
    };
  }

  return {
    token: { token: authToken },
    decodedToken: decodedToken
  };
});