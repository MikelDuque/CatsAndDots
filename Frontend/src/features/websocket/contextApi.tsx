"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { HTTPS_WEBSOCKET, WEBSOCKET_URL } from "@/lib/endpoints";
import { getAuth } from "@/features/auth/queries/get-auth";
import { usePathname } from "next/navigation";
import useFetch from "../auth/queries/useFetch";

/* ---- TIPADOS ---- */
type WebsocketContextType = {
    socket: WebSocket | undefined;
}

type WebsocketProviderProps = {
    children: ReactNode;
}

/* ----- DECLARACIÓN Context ----- */
const WebsocketContext = createContext<WebsocketContextType | undefined>(undefined);

export const useWebsocketContext = (): WebsocketContextType => {
    const context = useContext(WebsocketContext);
    if (!context) throw new Error("El contexto debe usarse dentro del provider");
    return context;
};

/* ----- CUERPO del Context ----- */
export function WebsocketProvider({ children }: WebsocketProviderProps) {
    const {fetchingData, fetchError} = useFetch();
    const pathName = usePathname();
    
    const [token, setToken] = useState<string>();
    const [socket, setSocket] = useState<WebSocket>();
    //const [message, setMessage] = useState<GenericMessage | null | undefined>(null);
    
    useEffect(() => {
        console.log("renderiza context api");
        
        async function LeerToken() {
            const auth = await getAuth();
            if(auth.token) setToken(auth.token);
            if (!auth.token) await fetchingData({url: HTTPS_WEBSOCKET, type: "GET", token: auth.token, needAuth: true});
        }
        LeerToken();
    }, [pathName]);

    useEffect(() => {
        if (!token || socket || fetchError) return;

        const ws = new WebSocket(`${WEBSOCKET_URL}?accessToken=${token}`);

        ws.onopen = () => {
            setSocket(ws);
            console.log("WebSocket conectado.", ws);
        };

        /*
        ws.onmessage = (event: MessageEvent) => {
            console.log("evento", event.data);
            
            const jsonData = JSON.parse(event.data);
            setMessage(jsonData);
            console.log("mensaje ws: ", jsonData)
        };
        */

        ws.onclose = () => {
            setSocket(undefined);
            console.log("WebSocket desconectado.");
        };

        ws.onerror = (error) => {
            console.error("Error en WebSocket:", error);
            if (error instanceof Error) {
                console.error("Detalles del error:", error.message);
            } else {
                console.error("Detalles del error desconocido", error); 
            }
        };    

        return () => {
            ws.close();
        };

    }, [token]);

    /*
    function sendMessage(message: object) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            console.warn("No hay conexión WebSocket activa.");
        }
    };
    */

    /* ----- Fin Context ----- */
    const contextValue: WebsocketContextType = {
        socket
        //message
    };

    return <WebsocketContext.Provider value={contextValue}>{children}</WebsocketContext.Provider>
};