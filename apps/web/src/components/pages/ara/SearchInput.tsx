import Button from "@/components/Button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import * as yup from "yup";

const CtaInputValidationSchema = yup.object().shape({
  term: yup
    .string()
    .min(3, "Arama terimi 3 karakterden kısa olamaz.")
    .max(50, "Arama terimi 50 karakterden uzun olamaz.")
    .required("Arama terimi boş bırakılamaz.")
    .matches(/^[a-zA-Z0-9ığüşöçİĞÜŞÖÇ ]+$/, "Arama terimi geçersiz."),
});

interface CtaInputProps extends React.ComponentPropsWithoutRef<"input"> {
  placeholder?: string;
  onSearch?: (term: string) => void;
  initialTerm?: string;
}

export default function CtaInput({
  placeholder,
  onSearch,
  initialTerm,
  className,
  ...rest
}: CtaInputProps) {
  const [term, setTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTerm(initialTerm || "");
  }, [initialTerm]);

  function validate() {
    CtaInputValidationSchema.validate({ term })
      .then(() => {
        onSearch?.(term);
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  return (
    <div className={className}>
      <div
        className={cn(
          "group relative flex items-center",
          "scale-95 rounded-full",
          "transition duration-150",
          "focus-within:scale-100 focus-within:shadow-lg"
        )}
      >
        <input
          type="text"
          value={term}
          placeholder={placeholder}
          onChange={(e) => {
            setError(null), setTerm(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              validate();
            }
          }}
          onBlur={() => setError(null)}
          onClick={() => setError(null)}
          className={cn(
            "w-full rounded-full p-4 outline-none sm:px-8 sm:py-4",
            "text-sm font-medium ring-1 ring-black sm:text-xl",
            "transition duration-100",
            "focus:ring-2 group-hover:ring-2"
          )}
          {...rest}
        />
        <div
          className={cn(
            "absolute inset-y-1 right-1",
            "transition duration-100"
          )}
        >
          <Button
            className="h-full px-4 text-sm sm:px-6 sm:text-base"
            onClick={() => {
              validate();
            }}
          >
            Hemen Ara
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            className={cn("ml-8 text-sm font-medium text-red-600")}
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
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
