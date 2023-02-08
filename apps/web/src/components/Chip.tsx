import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  shadows?: boolean;
}

export default function Chip({ label, shadows = false }: ChipProps) {
  return (
    <div
      className={cn(
        "flex select-none items-center justify-center rounded-full px-4 py-1 text-sm font-medium text-black ring-1 ring-black",
        shadows && "shadow-[2px_4px_0_0_rgba(0,0,0,1.0)]"
      )}
    >
      {label}
    </div>
  );
}
