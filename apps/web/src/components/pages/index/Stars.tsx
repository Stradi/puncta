import { StarIcon } from "@/components/Icons";
import { cn } from "@/lib/utils";

export default function Stars() {
  return (
    <div className="inline-block min-w-min max-w-min">
      <div
        className={cn(
          "flex rounded-full px-4 py-1 md:px-6 md:py-2",
          "border-4 border-black bg-primary-normal text-black",
          "translate-x-1 translate-y-1 transition duration-100",
          "hover:shadow-[4px_4px_0_0_rgba(0,0,0,1.0)]",
          "hover:translate-x-0 hover:translate-y-0"
        )}
      >
        <StarIcon
          fillColor="white"
          stroke="thin"
          svgClassName="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16"
        />
        <StarIcon
          fillColor="white"
          stroke="thin"
          svgClassName="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16"
        />
        <StarIcon
          fillColor="black"
          stroke="thin"
          svgClassName="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16"
        />
      </div>
    </div>
  );
}
