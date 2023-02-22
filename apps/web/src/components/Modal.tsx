import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CloseIcon } from "./Icons";

interface ModalProps extends React.ComponentPropsWithoutRef<"div"> {
  handleClose: () => void;
  maxWidth?: "sm" | "md" | "lg";
  hideCloseIcon?: boolean;
}

export default function Modal({
  handleClose,
  maxWidth = "md",
  hideCloseIcon = false,
  children,
  className,
}: ModalProps) {
  return (
    <motion.div
      className={cn("absolute inset-0 h-full w-full", "bg-black/50")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <div
        className={cn(
          "relative h-full md:top-1/2 md:mx-auto md:h-auto md:-translate-y-1/2",
          "border-2 border-black bg-white",
          {
            "max-w-md": maxWidth === "sm",
            "max-w-lg": maxWidth === "md",
            "max-w-xl": maxWidth === "lg",
          }
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cn("p-4", className)}>
          {!hideCloseIcon && (
            <CloseIcon
              size="lg"
              onClick={handleClose}
              className="float-right cursor-pointer"
            />
          )}
          <div>{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
