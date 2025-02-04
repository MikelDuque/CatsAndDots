import { useWebsocket } from "@/features/websocket/websocket-context";
import { GenericMessage, MenuData } from "@/lib/types";
import { Dices, Swords, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function BasicData() {
  const {socket} = useWebsocket();
  const [menuData, setMenuData] = useState<MenuData>();

  useEffect(() => {
    if(socket && socket.readyState === socket.OPEN) socket.addEventListener("message", handleMessage);

    function handleMessage(event: MessageEvent) {
      console.log("hola, escuchas?", event);
      
      const message = JSON.parse(event.data) as GenericMessage;
  
      if (message.MessageType === "MenuData") setMenuData(message.Body as MenuData);
    }

    //CAMBIAR LOGICA BACKEND, ENVIAR 1 ÚNICO MENSAJE AL CONECTAR UN USUAARIO
    //PEDIR POR MÉTODO GET LA LISTA DE AMIGOS
    //Y QUEDARSE A LA ESCUCHA DE DICHO MENSAJE PARA CAMBIAR LOS ESTADOS

    return () => {
      socket?.removeEventListener("message", handleMessage);
    }
  }, [socket]);


  /*
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event: MessageEvent) => {
        console.log("evento", event.data);
        
        const message = JSON.parse(event.data) as GenericMessage;
        console.log("message", message);
        
  
        if (message.MessageType === "MenuData") setMenuData(message.Body as MenuData);
      };
    };
  }, [socket])
  */

  /*
  useEffect(() => {
    console.log("use effect basic data", message);
    
    if(message?.MessageType === "MenuData") {
      setMenuData((previous) => message?.Body as MenuData || {...previous});

    };
  }, [message]);

  console.log("menuData", menuData);
  */

  return (
    <div className="flex gap-5 items-center">
      <div className="flex gap-2"><Users/> {menuData?.OnlineUsers || 0}</div>
      <div className="flex gap-2"><Swords/> {menuData?.PlayingUsers || 0}</div>
      <div className="flex gap-2"><Dices/> {menuData?.CurrentMatches || 0}</div>
    </div>
  );
}