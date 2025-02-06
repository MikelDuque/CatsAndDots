"use client";

import { createContext, useState, useContext, ReactNode } from "react";

/* ---- TIPADOS ---- */
type ModalContextType = {
  whichIsOpen: string | undefined | null;
  openModal: (id : string | null | undefined) => void; 
  closeModal: () => void;
}

type ModalProviderProps = {
    children: ReactNode;
}

/* ----- DECLARACIÓN Context ----- */
const ModalContext = createContext<ModalContextType> ({
  whichIsOpen: null,
  openModal: () => {},
  closeModal: () => {}

});

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("El contexto debe usarse dentro del provider");
  return context;
}

/* ----- CUERPO del Context ----- */
export function ModalProvider({children}: ModalProviderProps) {
  const [whichIsOpen, setWhichIsOpen] = useState<string | null | undefined>(null);

  function openModal(id: string | null | undefined) {
    setWhichIsOpen(id);
  };

  function closeModal() {
    setWhichIsOpen(null);
  };

  /* ----- Fin Context ----- */
  const contextValue: ModalContextType = {
    whichIsOpen,
    openModal,
    closeModal
  };

  return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>;
};

