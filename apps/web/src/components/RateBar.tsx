import { cn } from "@/lib/utils";

interface RateBarProps {
  value: number;
  max: number;
}

export default function RateBar({ value, max }: RateBarProps) {
  const stepToColors: Record<number, string> = {
    1: "bg-red-500",
    2: "bg-orange-500",
    3: "bg-yellow-500",
    4: "bg-green-500",
    5: "bg-primary-normal",
  };

  const howManySteps = Math.round((value / max) * 5);

  return (
    <div
      title={`${max} üzerinden ${value}`}
      className="flex [&>*:first-child]:rounded-l-full [&>*:last-child]:rounded-r-full"
    >
      {Object.keys(stepToColors).map((step, idx) => (
        <div
          key={idx}
          className={cn(
            "relative h-3 w-full bg-white ring-1 ring-black",
            idx < howManySteps ? stepToColors[Number(step)] : ""
          )}
        ></div>
      ))}
    </div>
  );
}
