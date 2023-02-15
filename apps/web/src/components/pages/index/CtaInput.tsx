import Button from "@/components/Button";
import { TeacherIcon, UniversityIcon } from "@/components/Icons";
import { searchTeacher, searchUniversity } from "@/lib/search";
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
    ((Teacher & { type: "teacher" }) | (University & { type: "university" }))[]
  >([]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChangeHandler = useCallback(debounce(handleChange, 500), []);

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
      const universities = (await searchUniversity(term)).map(
        (item: University) => ({
          ...item,
          type: "university",
        })
      );
      if (universities.length === 0) {
        const teachers = (await searchTeacher(term, 3)).map(
          (item: Teacher) => ({
            ...item,
            type: "teacher",
          })
        );

        setSuggestions([...universities, ...teachers].slice(0, 2));
        setIsLoading(false);
      } else {
        setSuggestions(universities.slice(0, 2));
        setIsLoading(false);
      }
    }

    if (term.length > 2) {
      setIsLoading(true);
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
        {showSuggestions && suggestions.length > 0 && !isLoading && (
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

                const icon =
                  item.type === "university" ? (
                    <UniversityIcon stroke="thin" />
                  ) : (
                    <TeacherIcon stroke="thin" />
                  );

                return (
                  <li
                    key={item.slug}
                    className="rounded-full hover:ring-1 hover:ring-black"
                  >
                    <Link href={`${href}/${item.slug}`}>
                      <span className="flex w-full items-center gap-2 py-2 px-4">
                        <div>{icon}</div>
                        <div className="flex flex-col">
                          {item.name}
                          {item.type === "teacher" && (
                            <div className="text-xs text-gray-500">
                              <span>{item.university?.name}</span>,{" "}
                              <span>{item.faculty?.name}</span>
                            </div>
                          )}
                        </div>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </div>
          </motion.ul>
        )}
        {isLoading && (
          <div className="absolute mt-2 w-full rounded-3xl border border-black bg-white px-6 py-4 text-center font-medium">
            Sonuçlar aranıyor...
          </div>
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
