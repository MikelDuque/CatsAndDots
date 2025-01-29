"use client"
import { getAuth } from "@/features/auth/queries/get-auth";
import { useState, useEffect } from "react";
import { useWebsocketContext } from "@/features/websocket/contextApi";
import MenuHeader from "@/components/menu/menuHeader";
import ThemeSwitcher from "@/components/theme/theme-switcher";
export default  function Menu() {
  const [decodeToken, setDecodeToken] = useState<string | null>(null);  
  const { establecerConexion } = useWebsocketContext();
  useEffect(() => {
      async function establecerCanal() {
        const authData = await getAuth();
        if (authData?.token) {
          setDecodeToken(authData?.decodedToken?.unique_name ?? "Invitado");
          console.log("Establecer conexions")
            establecerConexion(authData.token);
           
        }
      }
  
      establecerCanal();
  }, []);

  return (
    <>
    <main>
    <MenuHeader decodedToken={decodeToken} />
    </main>
    <ThemeSwitcher/>
    </>
  );
}