"use client"

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getAuth } from "./queries/get-auth";
import { DecodedToken } from "@/lib/types";

/* ---- TIPADOS ---- */
type AuthContextType = {
  token: string | undefined;
  decodedToken: DecodedToken;
}

type AuthProviderProps = {
  children: ReactNode;
}

/* ----- DECLARACIÓN Context ----- */
const AuthContext = createContext<AuthContextType>({
  token:undefined,
  decodedToken:undefined
});

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("El contexto debe usarse dentro del provider");
  return context;
};

/* ----- CUERPO del Context ----- */
export function AuthProvider({ children }: AuthProviderProps) {
  const pathName = usePathname();

  const [authData, setAuthData] = useState<AuthContextType>();
 
  useEffect(() => {
    async function GetToken() {
      const auth = await getAuth();
      if(auth.token && !authData) setAuthData(auth);
    }

    GetToken();
  }, [pathName]);


  /* ----- Fin Context ----- */
  const contextValue: AuthContextType = {
    token: authData?.token,
    decodedToken: authData?.decodedToken
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
};