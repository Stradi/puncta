import { cn } from "@/lib/utils";

interface BaseIconProps extends React.ComponentPropsWithoutRef<"i"> {
  size?: "sm" | "md" | "lg";
  stroke?: "thin" | "medium" | "thick";
}

function BaseIcon({
  size = "md",
  stroke = "medium",
  children,
  ...props
}: BaseIconProps) {
  return (
    <i {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={cn(
          stroke == "thin" && 1,
          stroke == "medium" && 1.5,
          stroke == "thick" && 2
        )}
        stroke="currentColor"
        className={cn(
          size == "sm" && "h-4 w-4",
          size == "md" && "h-6 w-6",
          size == "lg" && "h-8 w-8"
        )}
      >
        {children}
      </svg>
    </i>
  );
}

export function HamburgerIcon({ ...props }: BaseIconProps) {
  return (
    <BaseIcon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </BaseIcon>
  );
}

export function CloseIcon({ ...props }: BaseIconProps) {
  return (
    <BaseIcon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </BaseIcon>
  );
}
