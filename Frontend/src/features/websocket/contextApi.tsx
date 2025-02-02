"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { WEBSOCKET_URL } from "@/lib/endpoints";
import { getAuth } from "@/features/auth/queries/get-auth";
import { GenericMessage } from "../../lib/types";
import { useRouter } from "next/navigation";

/* ---- TIPADOS ---- */
type WebsocketContextType = {
    socket: WebSocket | null | undefined;
    message: GenericMessage;
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
    
    const [token, setToken] = useState<string | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [message, setMessage] = useState<GenericMessage | null | undefined>(null);
    
    //Guarda el Token en un state para usarlo en la llamada al websocket
    useEffect(() => {
        
        async function LeerToken() {
            const authData = await getAuth();
            setToken(authData.token);    
        }
        LeerToken();
    }, [useRouter()]);
    

    useEffect(() => {
        if (!token || socket) return; // No conectar si no hay token o ya hay un socket activo

        const ws = new WebSocket(`${WEBSOCKET_URL}?accessToken=${token}`);

        ws.onopen = () => {
            setSocket(ws);
            console.log("WebSocket conectado.", ws);
        };

        ws.onmessage = (event: MessageEvent) => {
            console.log("evento", event);
            
            const jsonData = JSON.parse(event.data);
            setMessage(jsonData);
            console.log("mensaje ws: ", jsonData)
        };

        ws.onclose = () => {
            setSocket(null);
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
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            console.warn("No hay conexión WebSocket activa.");
        }
    };

    /* ----- Fin Context ----- */
    const contextValue: WebsocketContextType = {
        socket,
        message,
        sendMessage,
        setToken
    };

    return <WebsocketContext.Provider value={contextValue}>{children}</WebsocketContext.Provider>
};