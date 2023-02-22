import { useField } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { InfoIcon } from "../Icons";
import RateSliderStyles from "./RateSlider.module.css";

interface RateSliderProps extends React.ComponentPropsWithoutRef<"input"> {
  name: string;
  label: string;
  info?: string;

  valueToText: {
    [key: number]: string;
  };
}

export default function RateSlider({
  name,
  label,
  info,
  valueToText,
  ...props
}: RateSliderProps) {
  const [field, meta, helpers] = useField({ name });
  const [valueText, setValueText] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);

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
      <div className="flex items-center gap-1">
        {info && (
          <InfoIcon
            size="sm"
            onClick={() => {
              setIsInfoOpen((prev) => !prev);
            }}
          />
        )}
        <label htmlFor={name} className="font-medium text-neutral-700">
          {label}
        </label>
      </div>
      <AnimatePresence>
        {isInfoOpen && (
          <motion.div
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
            <span className="text-sm font-medium">{info}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="-mb-0.5 flex items-center justify-between gap-2">
        <input
          {...field}
          {...props}
          type="range"
          className={RateSliderStyles.input}
        />
        <span className="mb-1 h-full w-8 text-center font-mono text-lg font-bold md:text-2xl">
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
