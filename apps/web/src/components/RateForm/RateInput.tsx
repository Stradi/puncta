import { cn } from "@/lib/utils";
import { useField } from "formik";
import { useState } from "react";

interface RateInputProps {
  name: string;
  label: string;

  steps: {
    value: number;
    text: string;
  }[];
}

export default function RateInput({ name, label, steps }: RateInputProps) {
  const [field, meta, helpers] = useField({ name });
  const [hoveringOn, setIsHoveringOn] = useState(-1);

  const stepToColors: Record<number, string> = {
    1: "bg-red-500",
    2: "bg-orange-500",
    3: "bg-yellow-500",
    4: "bg-green-500",
    5: "bg-primary-normal",
  };

  const stepToHoverColors: Record<number, string> = {
    1: "bg-red-300",
    2: "bg-orange-300",
    3: "bg-yellow-300",
    4: "bg-green-300",
    5: "bg-primary-light-active",
  };

  return (
    <div className="flex flex-row justify-between gap-2">
      <label htmlFor={name} className="font-medium text-neutral-700">
        {label}
      </label>
      <div className="flex [&>*:first-child]:rounded-l-full [&>*:last-child]:rounded-r-full">
        {steps.map((step) => (
          <div
            key={step.value}
            onClick={() => {
              helpers.setValue(step.value);
            }}
            onMouseEnter={() => {
              setIsHoveringOn(step.value);
            }}
            onMouseLeave={() => {
              setIsHoveringOn(-1);
            }}
            className={cn(
              "relative h-8 w-full bg-white ring-2 ring-black hover:cursor-pointer",
              "transition duration-100",
              {
                [stepToColors[step.value]]:
                  step.value <= field.value && hoveringOn === -1,
              },
              {
                [stepToColors[step.value]]:
                  hoveringOn !== -1 && hoveringOn >= step.value,
              },
              {
                [stepToHoverColors[step.value]]:
                  hoveringOn !== -1 && hoveringOn === step.value,
              }
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 w-full -translate-y-1/2",
                "select-none text-center text-sm font-medium text-black",
                "transition duration-100",
                {
                  "font-bold": hoveringOn === step.value,
                }
              )}
            >
              {step.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
