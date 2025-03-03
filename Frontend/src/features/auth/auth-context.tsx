"use client"

import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { getAuth } from "./queries/get-auth";
import { LogOut as serverLogOut } from "@/features/auth/actions/server-actions";
import { DecodedToken } from "@/lib/types";

/* ---- TIPADOS ---- */
type AuthContextType = {
  token: string | undefined;
  decodedToken: DecodedToken;
  logOut: () => void
}

type AuthProviderProps = {
  children: ReactNode;
}

type AuthType = {
  token: string | undefined;
  decodedToken: DecodedToken;
}

/* ----- DECLARACIÓN Context ----- */
const AuthContext = createContext<AuthContextType>({
  token:undefined,
  decodedToken:undefined,
  logOut(){}
});

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("El contexto debe usarse dentro del provider");
  return context;
};

/* ----- CUERPO del Context ----- */
export function AuthProvider({ children }: AuthProviderProps) {
  const pathName = usePathname();
  const [authData, setAuthData] = useState<AuthType>();

  const GetToken = useCallback(async () => {
    const auth = await getAuth();
    setAuthData(auth.token && !authData ? auth : undefined);
  }, []); 
  
  useEffect(() => {
    GetToken();
  }, [GetToken, pathName]);

  const logOut = useCallback(async () => {
    await serverLogOut();
    setAuthData(undefined);
  }, []);
  

  /* ----- Fin Context ----- */
  const contextValue: AuthContextType = {
    token: authData?.token,
    decodedToken: authData?.decodedToken,
    logOut
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
};