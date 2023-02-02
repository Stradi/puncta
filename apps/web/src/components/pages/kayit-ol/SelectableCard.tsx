import { cn } from "@/lib/utils";

interface SelectableCardProps extends React.ComponentPropsWithoutRef<"div"> {
  selected?: boolean;
}

export default function SelectableCard({
  selected,
  onClick,
  children,
  ...props
}: SelectableCardProps) {
  return (
    <div
      className={cn(
        "flex aspect-[3/2] h-full w-full items-center p-4 text-center",
        "border-2 border-black",
        "transition duration-75",
        "hover:cursor-pointer",
        "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1.0)]",
        "active:-translate-x-0 active:-translate-y-0 active:shadow-[0px_0px_0_0_rgba(0,0,0,1.0)]",
        selected && "bg-primary-light-active",
        selected &&
          "-translate-x-1 -translate-y-1 shadow-[4px_4px_0_0_rgba(0,0,0,1.0)]"
      )}
      onClick={onClick}
    >
      <div className="w-full select-none text-xl font-medium" {...props}>
        {children}
      </div>
    </div>
  );
}
