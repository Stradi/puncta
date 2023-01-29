import { cn } from "@/lib/utils";

interface LetterGradeProps extends React.ComponentPropsWithoutRef<"p"> {
  letter: "A" | "B" | "C" | "D" | "F" | "N/A";
  size?: "small" | "medium" | "large";
}

export default function LetterGrade({
  letter,
  size = "medium",
  className,
  ...props
}: LetterGradeProps) {
  // TODO: Change colors
  const styling = {
    A: "bg-primary-normal text-primary-darker",
    B: "bg-green-500 text-green-900",
    C: "bg-yellow-500 text-yellow-900",
    D: "bg-orange-500 text-orange-900",
    F: "bg-red-500 text-red-900",
    "N/A": "bg-gray-500 text-gray-900",
  }[letter];

  return (
    <p
      className={cn(
        "flex select-none items-center justify-center",
        "border-2 border-black",
        "font-mono text-5xl font-bold",
        styling,
        size === "small" && "h-12 w-12 text-4xl",
        size === "medium" && "h-16 w-16",
        size === "large" && "h-20 w-20",
        className
      )}
      title={`Letter grade is ${letter}`}
      {...props}
    >
      {letter}
    </p>
  );
}
