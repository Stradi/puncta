import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
      <motion.div
        className={cn(
          "relative top-1/4 mx-auto max-w-lg",
          "border-2 border-black bg-white"
        )}
        initial={{
          opacity: 0,
          height: 0,
        }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cn("p-4", className)}>{children}</div>
      </motion.div>
    </motion.div>
  );
}
