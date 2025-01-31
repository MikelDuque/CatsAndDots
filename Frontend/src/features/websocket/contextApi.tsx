"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { WEBSOCKET_URL } from "@/lib/endpoints";
import { getAuth } from "@/features/auth/queries/get-auth";

interface WebsocketContextType {
    sendMessage: (message: object) => void;
    isConnected: boolean;
    data: WebsocketData;
}
interface WebsocketData {
    onlineUsers: number;
    playingUsers: number;
    currentMatches: number;
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
    const [data, setData] = useState<WebsocketData>({ onlineUsers: 0, playingUsers: 0, currentMatches: 0 });

    useEffect(() => {
        async function LeerToken() {
            const authData = await getAuth();
            setToken(authData.token);
        }
        LeerToken();
    }, []);

    useEffect(() => {
        if (!token || socket) return; // No conectar si no hay token o ya hay un socket activo

        const ws = new WebSocket(`${WEBSOCKET_URL}?accessToken=${token}`);

        ws.onopen = () => {
            console.log("WebSocket conectado.", ws);
            setSocket(ws);
            setIsConnected(true);
        };

        ws.onmessage = (event: MessageEvent) => {
            const parsedData = JSON.parse(event.data);
            console.log("mensaje ws: ", parsedData)
            setData({
                onlineUsers: parsedData.OnlineUsers || 0,
                playingUsers: parsedData.PlayingUsers || 0,
                currentMatches: parsedData.CurrentMatches || 0
            });
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
        data,
    };

    return (
        <WebsocketContext.Provider value={contextValue}>
            {children}
        </WebsocketContext.Provider>
    );
};
