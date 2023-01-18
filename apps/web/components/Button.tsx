/* eslint-disable tailwindcss/no-custom-classname */
import { cn } from "@/lib/utils";

export enum ButtonVariant {
  Primary,
  Text,
  Plain,
}

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  label: string;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
}

export default function Button({
  label,
  icon,
  variant = ButtonVariant.Primary,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "h-10 rounded-full px-6",
        "border-2 border-black text-black transition-all duration-100",
        "active:shadow-none",

        icon && "flex items-center gap-2 pl-4 pr-6",

        variant === ButtonVariant.Primary &&
          [
            "bg-primary-normal font-medium",
            "hover:bg-primary-normal-hover hover:ring-1 hover:ring-black",
            "active:bg-primary-normal-active active:ring-0",
          ].join(" "),

        variant === ButtonVariant.Text &&
          [
            "border-0 font-bold text-black",
            "underline underline-offset-1",
            "hover:underline-offset-4",
            "active:underline-offset-1",
          ].join(" "),

        variant === ButtonVariant.Plain && "border-0 font-medium text-black",
        className
      )}
      {...props}
    >
      {icon && icon}
      {label}
    </button>
  );
}
