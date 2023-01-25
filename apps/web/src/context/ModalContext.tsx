import Modal from "@/components/Modal";
import { AnimatePresence } from "framer-motion";
import { createContext, useState } from "react";

interface ModalContextProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
}

export const ModalContext = createContext<ModalContextProps>(
  {} as ModalContextProps
);

export function ModalProvider({ children }: React.PropsWithChildren<{}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen, content, setContent }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <Modal handleClose={() => setIsOpen(false)}>{content}</Modal>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}
