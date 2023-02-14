import Button from "@/components/Button";
import { searchTerm } from "@/lib/search";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import debounce from "lodash.debounce";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
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
}

export default function CtaInput({
  placeholder,
  className,
  ...rest
}: CtaInputProps) {
  const [term, setTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<
    {
      name: string;
      slug: string;
      type: "university" | "teacher";
    }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const router = useRouter();

  function onSearchButtonClick() {
    CtaInputValidationSchema.validate({ term })
      .then(() => {
        router.push(`/ara?q=${term}`);
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  const debouncedChangeHandler = useCallback(debounce(handleChange, 100), []);
  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setError(null);
    setTerm(e.target.value);
  }

  useEffect(() => {
    async function getSuggestions() {
      searchTerm(term).then((res) => {
        setSuggestions(
          res.results.slice(0, 2).map((item: any) => ({
            name: item.name,
            slug: item.slug,
            type: item.type,
          }))
        );
      });
    }

    if (term.length > 2) {
      getSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [term]);

  return (
    <div className={cn("relative", className)}>
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
          placeholder={placeholder}
          onChange={debouncedChangeHandler}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearchButtonClick();
            }
          }}
          onBlurCapture={(e) => {
            setError(null);
            setTimeout(() => {
              setShowSuggestions(false);
            }, 75);
          }}
          onClick={() => {
            setError(null), setShowSuggestions(true);
          }}
          onFocus={() => {
            setError(null), setShowSuggestions(true);
          }}
          className={cn(
            "w-full rounded-full p-4 outline-none sm:px-8",
            "text-base font-medium ring-1  ring-black sm:text-xl",
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
            className="h-full"
            onClick={onSearchButtonClick}
            onFocus={() => {
              setError(null), setShowSuggestions(true);
            }}
          >
            Hemen Ara
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.ul
            className="absolute mt-2 w-full rounded-3xl border border-black bg-white font-medium"
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
            <div className="p-2">
              {suggestions.slice(0, 2).map((item) => {
                const href =
                  item.type === "university" ? "/universite" : "/ogretmen";

                return (
                  <li
                    key={item.slug}
                    className="rounded-full hover:ring-1 hover:ring-black"
                  >
                    <Link
                      href={`${href}/${item.slug}`}
                      className="inline-block w-full py-2 px-4"
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>

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
