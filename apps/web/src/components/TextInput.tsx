import { cn } from "@/lib/utils";

interface TextInputProps extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
}

export default function TextInput({
  label,
  className,
  ...props
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={label} className="text-sm font-semibold">
        {label}
      </label>
      <input
        type="text"
        id={label}
        className={cn(
          "rounded-full border border-black px-4 py-2",
          "font-medium text-black",
          "transition duration-100",
          "hover:ring-2 hover:ring-black",
          "focus:ring-primary-normal-active focus:border-primary-normal-active focus:outline-none focus:ring-2",
          className
        )}
        {...props}
      />
    </div>
  );
}
