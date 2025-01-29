"use client"
import { createContext, useState, useContext, ReactNode } from "react";
import { WEBSOCKET_URL } from "@/lib/endpoints";


interface WebsocketContextType {
    establecerConexion: (token: string) => void;
    sendMessage: (message: object) => void;
    lastMessage: any; 
}


export const WebsocketContext = createContext<WebsocketContextType | undefined>(undefined);

export const useWebsocketContext = (): WebsocketContextType => {
    const context = useContext(WebsocketContext);
    if (!context) {
        throw new Error("useWebsocketContext debe usarse dentro de un WebsocketProvider");
    }
    return context;
};


interface WebsocketProviderProps {
    children: ReactNode;
}

export const WebsocketProvider = ({ children }: WebsocketProviderProps) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [lastMessage, setLastMessage] = useState<any>(null); 


    const establecerConexion = (token: string) => {
        if (socket) {
            console.warn("WebSocket ya está conectado.");
            return;
        }
        console.log(`establecerConexion ${WEBSOCKET_URL}?token=${token}`)
        const ws = new WebSocket(`${WEBSOCKET_URL}`);

        ws.onopen = () => {
            console.log("WebSocket conectado.");
            setSocket(ws);
        };

        ws.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            setLastMessage(data); 
        };

        ws.onclose = () => {
            console.log("WebSocket desconectado.");
            setSocket(null);
        };

        ws.onerror = (error) => {
            console.error("Error en WebSocket:", error);
        };
    };


    const sendMessage = (message: object) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            console.warn("No hay conexión WebSocket activa.");
        }
    };

    const contextValue: WebsocketContextType = {
        establecerConexion,
        sendMessage,
        lastMessage, 
    };

    return (
        <WebsocketContext.Provider value={contextValue}>
            {children}
        </WebsocketContext.Provider>
    );
};
