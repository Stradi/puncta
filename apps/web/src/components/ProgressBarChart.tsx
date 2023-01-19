import { cn } from "@/lib/utils";

interface ProgressBarChartProps {
  max: number;
  value: number;
  size?: "small" | "medium" | "large";
}

export function ProgressBarChart({
  max = 100,
  value = 0,
  size = "medium",
}: ProgressBarChartProps) {
  const percentage = (value / max) * 100;

  function percentageToColor(percent: number) {
    // TODO: Change colors
    const map = {
      0: "bg-red-500",
      25: "bg-orange-500",
      50: "bg-yellow-500",
      75: "bg-green-500",
      100: "bg-primary-normal",
    };

    const keys = Object.keys(map).map((key) => parseInt(key));
    const closestKey = keys.reduce((prev, curr) =>
      Math.abs(curr - percent) < Math.abs(prev - percent) ? curr : prev
    );

    return map[closestKey as keyof typeof map];
  }

  return (
    <div
      className={cn(
        "relative w-full",
        // Normally we should use border and border-black in here,
        // but I couldn't get inner and outer border to merge. :(
        "bg-primary-darker rounded-full ring-1 ring-black",
        size === "small" && "h-2",
        size === "medium" && "h-4",
        size === "large" && "h-6"
      )}
    >
      {percentage > 0 && (
        <div
          className={cn(
            "absolute inset-0",
            "rounded-full ring-1 ring-black",
            percentageToColor(percentage)
          )}
          style={{
            width: `${percentage}%`,
          }}
        ></div>
      )}
    </div>
  );
}
