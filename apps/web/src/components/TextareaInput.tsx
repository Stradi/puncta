import { cn } from "@/lib/utils";
import { useField } from "formik";
import { AnimatePresence, motion } from "framer-motion";

interface TextareaInputProps
  extends React.ComponentPropsWithoutRef<"textarea"> {
  name: string;
  label: string;
}

export default function TextareaInput({
  name,
  label,
  ...props
}: TextareaInputProps) {
  const [field, meta, helpers] = useField({ name });

  return (
    <div>
      <label htmlFor={name} className={cn("font-medium text-neutral-700")}>
        {label}
      </label>
      <textarea
        {...field}
        {...props}
        className={cn(
          "rounded-3xl px-4 py-2 transition duration-100",
          "resize-none",
          "border border-black font-medium outline-none"
        )}
      />
      <AnimatePresence>
        {meta.error && meta.touched && (
          <motion.div
            className={cn("text-sm font-medium text-red-600")}
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
          >
            {meta.error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
