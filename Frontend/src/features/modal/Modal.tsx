import { useModal } from "./ModalContext";
import classes from "./Modal.module.css";
import { ReactNode} from "react";
import Title from "@/components/utils/title";
import { Button } from "@/components/ui/button";

type ModalProps = {
  continueFnc?: () => void,
  cancelFnc?: () => void,
  type?: string,
  title?: string,
  buttonValues?: {
    continueVal?: string,
    cancelVal?: string
  },
  children: ReactNode
}

export default function Modal({continueFnc, cancelFnc, type, title, buttonValues, children}: ModalProps) {
  const {closeModal, whichIsOpen} = useModal();

  return (
    (whichIsOpen === type) && (
      <div className="fixed top-0 left-0 h-screen">
        <div className={`fixed z-1010 p-2 flex flex-col gap-2 bg-popover text-body text-popover-foreground modal-${type}`}>
          <div className="flex justify-between">
            <Title>{title}</Title>
            <a className="font-bold cursor-pointer" onClick={closeModal}>X</a>
          </div>
          <div className="h-full">{children}</div>
          {(buttonValues !== null) && (
            <div className="h-5 flex justify-evenly">
            <Button className={`confirmBtn--${type}`} onClick={() => {continueFnc?.(); closeModal?.()}}><Title>{buttonValues?.continueVal}</Title></Button>
            <Button className={`cancelBtn--${type}`} onClick={cancelFnc}><Title>{buttonValues?.cancelVal}</Title></Button>
          </div>
          )}
        </div>
        <div className="fixed top-0 left-0 h-screen w-screen z-10000 bg-black/50" onClick={closeModal}/>
      </div>
    )
  );
};