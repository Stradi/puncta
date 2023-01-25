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
  const [isDragging, setIsDragging] = useState(false);
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
    <div className="relative">
      <label htmlFor={name} className="font-medium text-neutral-700">
        {label}
      </label>
      <AnimatePresence>
        {
          <motion.span
            key={valueText}
            className="absolute left-0 top-0 w-full select-none text-center font-medium text-neutral-700"
            initial={{
              scale: 0.75,
              opacity: 0,
            }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.75, opacity: 0 }}
            transition={{
              duration: 0.1,
            }}
          >
            {valueText}
          </motion.span>
        }
      </AnimatePresence>
      <input
        {...field}
        {...props}
        type="range"
        className={RateSliderStyles.input}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      />
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
