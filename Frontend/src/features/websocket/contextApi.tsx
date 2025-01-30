"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { WEBSOCKET_URL } from "@/lib/endpoints";
import { getAuth } from "@/features/auth/queries/get-auth";

interface WebsocketContextType {
    sendMessage: (message: object) => void;
    isConnected: boolean;
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
    const [token, setToken] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        async function LeerToken() {
            const authData = await getAuth();
            setToken(authData.token);
        }
        LeerToken();
    }, []);

    useEffect(() => {
        if (!token || socket) return; // No conectar si no hay token o ya hay un socket activo

        const ws = new WebSocket(`${WEBSOCKET_URL}?token=${token}`);

        ws.onopen = () => {
            console.log("WebSocket conectado.");
            setSocket(ws);
            setIsConnected(true);
        };

        ws.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            console.log("Mensaje recibido:", data);
        };

        ws.onclose = () => {
            console.log("WebSocket desconectado.");
            setSocket(null);
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error("Error en WebSocket:", error);
        };

        return () => {
            ws.close();
        };
    }, [token]);

    const sendMessage = (message: object) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            console.warn("No hay conexión WebSocket activa.");
        }
    };

    const contextValue: WebsocketContextType = {
        sendMessage,
        isConnected,
    };

    return (
        <WebsocketContext.Provider value={contextValue}>
            {children}
        </WebsocketContext.Provider>
    );
};
