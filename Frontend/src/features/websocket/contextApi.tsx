"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { WEBSOCKET_URL } from "@/lib/endpoints";
import { getAuth } from "@/features/auth/queries/get-auth";
import { GenericMessage } from "../auth/types";

/* ---- TIPADOS ---- */
type WebsocketContextType = {
    data: GenericMessage | null | undefined;
    sendMessage: (message: object) => void;
    setToken: (token: string | null) => void;
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
    const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [data, setData] = useState<GenericMessage | null | undefined>(null);

    /*
    //Guarda el Token en un state para usarlo en la llamada al websocket
    useEffect(() => {
        async function LeerToken() {
            const authData = await getAuth();
            setToken(authData.token);    
        }
        LeerToken();
    }, []);
    */

    useEffect(() => {
        if (!token || webSocket) return; // No conectar si no hay token o ya hay un webSocket activo

        const ws = new WebSocket(`${WEBSOCKET_URL}?accessToken=${token}`);

        ws.onopen = () => {
            setWebSocket(ws);
            console.log("WebSocket conectado.", ws);
        };

        ws.onmessage = (event: MessageEvent) => {
            console.log("evento", event);
            
            const jsonData = JSON.parse(event.data);
            setData(jsonData);
            console.log("mensaje ws: ", jsonData)
        };

        ws.onclose = () => {
            setWebSocket(null);
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

    function sendMessage(message: object) {
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
            webSocket.send(JSON.stringify(message));
        } else {
            console.warn("No hay conexión WebSocket activa.");
        }
    };

    /* ----- Fin Context ----- */
    const contextValue: WebsocketContextType = {
        data,
        sendMessage,
        setToken
    };

    return <WebsocketContext.Provider value={contextValue}>{children}</WebsocketContext.Provider>
};