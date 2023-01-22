"use client";

import { cn } from "@/lib/utils";
import { useField } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SearchInputProps extends React.ComponentPropsWithoutRef<"input"> {
  name: string;
  label: string;
  items: string[];
}

export default function SearchInput({
  name,
  label,
  items,
  ...props
}: SearchInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSelected, setIsSelected] = useState(true);

  const [field, meta, helpers] = useField({ name });

  useEffect(() => {
    const newSuggestions = items.filter((item) =>
      item
        .toLocaleLowerCase()
        .replaceAll(" ", "")
        .includes(field.value.toLocaleLowerCase().replaceAll(" ", ""))
    );

    if (newSuggestions.length === 0) {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }

    setSuggestions(newSuggestions.slice(0, 5));
  }, [field.value, items]);

  function onFocus() {
    setShowSuggestions(true);
  }

  field.onBlur = (e: any) => {
    if (e.currentTarget.contains(e.relatedTarget)) {
      helpers.setTouched(true);
      setShowSuggestions(false);
    }
  };

  field.onChange = (e: any) => {
    helpers.setValue(e.target.value);
    setIsSelected(false);
  };

  function onSuggestionClick(suggestion: string) {
    setIsSelected(true);
    setShowSuggestions(false);
    helpers.setValue(suggestion);
  }

  return (
    <div>
      <label htmlFor={name} className={cn("font-medium text-neutral-700")}>
        {label}
      </label>
      <input
        {...field}
        {...props}
        onFocus={onFocus}
        type="search"
        autoComplete="off"
        className={cn(
          "mb-2 rounded-full px-4 py-2 transition duration-100",
          "border border-black font-medium outline-none"
        )}
      />
      <AnimatePresence>
        {!isSelected && showSuggestions && (
          <motion.ul
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
            className={cn(
              "text-ellipsis rounded-3xl border border-black font-medium"
            )}
          >
            <div className="box-border space-y-2 p-2">
              {suggestions.map((suggestion) => (
                <li
                  // We are adding tabIndex={0} to make the li element focusable
                  // so that we can catch the onBlur event.
                  tabIndex={0}
                  key={suggestion}
                  value={suggestion}
                  onClick={(e) => onSuggestionClick(e.currentTarget.innerText)}
                  className={cn(
                    "rounded-full px-4 py-2 transition duration-100 hover:cursor-pointer hover:outline hover:outline-1"
                  )}
                >
                  {suggestion}
                </li>
              ))}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
