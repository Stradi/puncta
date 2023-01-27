import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CloseIcon } from "./Icons";

interface ModalProps extends React.ComponentPropsWithoutRef<"div"> {
  handleClose: () => void;
}

export default function Modal({
  handleClose,
  children,
  className,
}: ModalProps) {
  return (
    <motion.div
      className={cn("absolute inset-0 h-full w-full", "bg-black/50")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        handleClose();
      }}
    >
      <div
        className={cn(
          "relative top-1/2 mx-auto max-w-lg -translate-y-1/2",
          "border-2 border-black bg-white"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cn("p-4", className)}>
          <CloseIcon
            size="lg"
            onClick={() => {
              handleClose();
            }}
            className="float-right cursor-pointer"
          />
          <div>{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
