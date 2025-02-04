"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { WEBSOCKET_URL } from "@/features/endpoints/endpoints";
import { useAuth } from "../auth/auth-context";
import { usePathname } from "next/navigation";
import { getAuth } from "../auth/queries/get-auth";

/* ---- TIPADOS ---- */
type WebsocketContextType = {
    socket: WebSocket | undefined;
}

type WebsocketProviderProps = {
    children: ReactNode;
}

/* ----- DECLARACIÓN Context ----- */
const WebsocketContext = createContext<WebsocketContextType>({socket: undefined});

export const useWebsocket = (): WebsocketContextType => {
    const context = useContext(WebsocketContext);
    if (!context) throw new Error("El contexto debe usarse dentro del provider");
    return context;
};

/* ----- CUERPO del Context ----- */
export function WebsocketProvider({ children }: WebsocketProviderProps) {
    const {token}  = useAuth();
    //const {fetchError} = useFetch({url: HTTPS_WEBSOCKET, type: "GET", token: token, needAuth: true, condition: !!token});
    const pathName = usePathname();
    
    //const [token, setToken] = useState<string>();
    const [socket, setSocket] = useState<WebSocket>();
    const [messages, setMessages] = useState<string[]>([]);
    //const [message, setMessage] = useState<GenericMessage | null | undefined>(null);
    
    /*
    useEffect(() => {
        console.log("renderiza context api");
        
        async function LeerToken() {
            const auth = await getAuth();
            if(auth.token) setToken(auth.token);
            //if (!auth.token) await fetchingData({url: HTTPS_WEBSOCKET, type: "GET", token: auth.token, needAuth: true});
        }
        LeerToken();
    }, [pathName]);
    */

    useEffect(() => {
        if (!token || socket) return;
        
        const ws = new WebSocket(`${WEBSOCKET_URL}?accessToken=${token}`);     

        ws.onopen = () => {
            setSocket(ws);
            console.log("WebSocket conectado.", ws);
        };

        /*
        ws.onmessage = (event: MessageEvent) => {
            //const jsonData = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, event.data]);

            console.log("mensaje ws: ", event.data);
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