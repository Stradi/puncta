import { useField } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import RateSliderStyles from "./RateSlider.module.css";

interface RateSliderProps extends React.ComponentPropsWithoutRef<"input"> {
  name: string;
  label: string;

  valueToText: {
    [key: number]: string;
  };
}

export default function RateSlider({
  name,
  label,
  valueToText,
  ...props
}: RateSliderProps) {
  const [field, meta, helpers] = useField({ name });
  const [valueText, setValueText] = useState("");

  useMemo(() => {
    const closestValue = Object.keys(valueToText).reduce((prev, curr) => {
      return Math.abs((curr as any) - field.value) <
        Math.abs((prev as any) - field.value)
        ? curr
        : prev;
    });

    setValueText(valueToText[Number.parseInt(closestValue)]);
  }, [field.value, valueToText]);
  return (
    <div>
      <label htmlFor={name} className="font-medium text-neutral-700">
        {label}
      </label>
      <div className="flex items-center justify-between gap-2">
        <input
          {...field}
          {...props}
          type="range"
          className={RateSliderStyles.input}
        />
        <span className="mb-1 h-full w-8 text-center font-mono text-2xl font-bold">
          {valueText}
        </span>
      </div>
      <AnimatePresence>
        {meta.error && meta.touched && (
          <motion.div
            className="text-sm font-medium text-red-600"
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
