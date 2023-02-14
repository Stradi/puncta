import { cn } from "@/lib/utils";

interface BaseIconProps extends React.ComponentPropsWithoutRef<"i"> {
  size?: "sm" | "md" | "lg" | "2xl";
  stroke?: "thinner" | "thin" | "medium" | "thick" | "thicker";
  fillColor?: string;
  svgClassName?: string;
}

function BaseIcon({
  size = "md",
  stroke = "medium",
  fillColor,
  svgClassName,
  children,
  className,
  ...props
}: BaseIconProps) {
  return (
    <i {...props} className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={fillColor || "none"}
        viewBox="0 0 24 24"
        strokeWidth={cn(
          stroke == "thinner" && 0.5,
          stroke == "thin" && 1,
          stroke == "medium" && 1.5,
          stroke == "thick" && 2,
          stroke == "thicker" && 4
        )}
        stroke="currentColor"
        className={cn(
          size == "sm" && "h-4 w-4",
          size == "md" && "h-6 w-6",
          size == "lg" && "h-8 w-8",
          size == "2xl" && "h-16 w-16",
          svgClassName
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

export function InfoIcon({ ...props }: BaseIconProps) {
  return (
    <BaseIcon {...props}>
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clipRule="evenodd"
      />
    </BaseIcon>
  );
}

export function SwitchIcon({ ...props }: BaseIconProps) {
  return (
    <BaseIcon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
      />
    </BaseIcon>
  );
}

export function StarIcon({ ...props }: BaseIconProps) {
  return (
    <BaseIcon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </BaseIcon>
  );
}

export function UniversityIcon({ ...props }: BaseIconProps) {
  return (
    <BaseIcon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
      />
    </BaseIcon>
  );
}

export function TeacherIcon({ ...props }: BaseIconProps) {
  return (
    <BaseIcon {...props}>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
      />
    </BaseIcon>
  );
}
