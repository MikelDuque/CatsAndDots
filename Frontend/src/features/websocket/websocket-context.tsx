"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { WEBSOCKET_URL } from "@/features/endpoints/endpoints";
import { useAuth } from "../auth/auth-context";
import { GenericMessage } from "@/lib/types";

/* ---- TIPADOS ---- */
type WebsocketContextType = {
    socket: WebSocket | undefined;
    messages: Record<string, Record<string, unknown>> | undefined;
}

type WebsocketProviderProps = {
    children: ReactNode;
}

/* ----- DECLARACIÓN Context ----- */
const WebsocketContext = createContext<WebsocketContextType>({
    socket: undefined,
    messages: undefined
});

export const useWebsocket = (): WebsocketContextType => {
    const context = useContext(WebsocketContext);
    if (!context) throw new Error("El contexto debe usarse dentro del provider");
    return context;
};

/* ----- CUERPO del Context ----- */
export function WebsocketProvider({ children }: WebsocketProviderProps) {
    const {token}  = useAuth();
    
    const [socket, setSocket] = useState<WebSocket>();
    const [messages, setMessages] = useState<Record<string, Record<string, unknown>>>({});

    useEffect(() => {
        if(socket) {
            if(!token) socket.close();
            return;
        };
        
        console.log(`url websocket: ${WEBSOCKET_URL}?accessToken=${token}`);
        const ws = new WebSocket(`${WEBSOCKET_URL}?accessToken=${token}`);
        console.log("Llamada al websocket", ws);

        ws.onopen = () => {
            setSocket(ws);
            console.log("WebSocket conectado.", ws);
        };
        
        ws.onmessage = (event: MessageEvent) => {
            const jsonData = JSON.parse(event.data) as GenericMessage;

            setMessages(prevMessages => ({
                ...prevMessages,
                [jsonData.messageType]: jsonData.body
            }));

            console.log("json ws", JSON.parse(event.data));
        };

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
        socket,
        messages
    };

    return <WebsocketContext.Provider value={contextValue}>{children}</WebsocketContext.Provider>
};