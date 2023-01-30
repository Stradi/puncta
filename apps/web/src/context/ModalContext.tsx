import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { AnimatePresence, motion } from "framer-motion";
import React, { createContext, useState } from "react";

interface ModalContextProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;

  closeConfirmation: React.ReactNode;
  setCloseConfirmation: (instantClose: React.ReactNode) => void;
}

export const ModalContext = createContext<ModalContextProps>(
  {} as ModalContextProps
);

export function ModalProvider({ children }: React.PropsWithChildren<{}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [closeConfirmation, setCloseConfirmation] =
    useState<React.ReactNode>(null);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  function handleClose() {
    if (!closeConfirmation) {
      setIsOpen(false);
    } else {
      setIsConfirmationOpen(true);
    }
  }

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        setIsOpen,
        content,
        setContent,
        closeConfirmation,
        setCloseConfirmation,
      }}
    >
      {children}
      <AnimatePresence>
        {isOpen && <Modal handleClose={handleClose}>{content}</Modal>}
        {isConfirmationOpen && (
          <Modal
            handleClose={() => setIsConfirmationOpen(false)}
            maxWidth="sm"
            hideCloseIcon
          >
            {closeConfirmation}
            <div>
              <AnimatePresence>
                <motion.div
                  className="flex"
                  initial={{ opacity: 0, height: "0px" }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: "0px" }}
                >
                  <Button
                    variant="text"
                    fullWidth
                    onClick={() => setIsConfirmationOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => {
                      setIsOpen(false);
                      setIsConfirmationOpen(false);
                    }}
                  >
                    Kapat
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}
