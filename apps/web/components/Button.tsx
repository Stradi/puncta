import { cn } from "@/lib/utils";
import Link from "next/link";
import ConditionalWrapper from "./ConditionalWrapper";

export enum ButtonVariant {
  Primary,
  Text,
  Plain,
}

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  asLink?: boolean;
  href?: string;
}

export default function Button({
  icon,
  variant = ButtonVariant.Primary,
  fullWidth = false,
  asLink = false,
  href = "",
  className,
  children,
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
        {children}
      </button>
    </ConditionalWrapper>
  );
}
