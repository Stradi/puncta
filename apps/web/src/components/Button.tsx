import { cn } from "@/lib/utils";
import Link from "next/link";
import ConditionalWrapper from "./ConditionalWrapper";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  icon?: React.ReactNode;
  variant?: "primary" | "text" | "plain";
  fullWidth?: boolean;
  asLink?: boolean;
  href?: string;
}

export default function Button({
  icon,
  variant = "primary",
  fullWidth = false,
  asLink = false,
  href = "",
  className,
  disabled,
  children,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <ConditionalWrapper
      condition={asLink}
      wrapper={(children) => <Link href={href}>{children}</Link>}
    >
      <button
        className={cn(
          "h-10 rounded-full px-6",
          "border-2 border-black text-black transition-all duration-100",
          "active:shadow-none",

          fullWidth && "w-full",
          icon && "flex items-center gap-2 pl-4 pr-6",

          variant === "primary" &&
            [
              "bg-primary-normal font-medium",
              !disabled &&
                "hover:bg-primary-normal-hover hover:ring-1 hover:ring-black",
              !disabled && "active:bg-primary-normal-active active:ring-0",
            ].join(" "),

          variant === "text" &&
            [
              "border-0 font-bold text-black",
              "underline underline-offset-1",
              !disabled && "hover:underline-offset-4",
              !disabled && "active:underline-offset-1",
            ].join(" "),

          variant === "plain" && "border-0 font-medium text-black",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        {...props}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
          } else {
            onClick?.(e);
          }
        }}
      >
        {icon && icon}
        {children}
      </button>
    </ConditionalWrapper>
  );
}
