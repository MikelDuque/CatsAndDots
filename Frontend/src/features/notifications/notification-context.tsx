"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

/* ---- TIPADOS ---- */
type NotificationContextType = {
  notifications: string[];
  addNotification: (newNotification: string) => void
}

type NotificationProviderProps = {
  children: ReactNode;
}

/* ----- DECLARACIÓN Context ----- */
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {}
});

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("El contexto debe usarse dentro del provider");
  return context;
};

/* ----- CUERPO del Context ----- */
export function NotificationProvider({children}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (notifications.length <= 0) return;
    toast(notifications.slice(-1)[0]);
    
  }, [notifications])

  function addNotification(newNotification: string) {
    setNotifications(prevState => 
      [...prevState,
      newNotification]
    );
  }

  /* ----- Fin Context ----- */
  const contextValue: NotificationContextType = {
    notifications,
    addNotification
  };

  return <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
};