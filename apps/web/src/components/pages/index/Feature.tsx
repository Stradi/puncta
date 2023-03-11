import { cn } from "@/lib/utils";
import Image from "next/image";

interface FeatureProps {
  leftSide: {
    title: string;
    subtitle: string;
    image: string;
  };
  rightSide: React.ReactNode;
  color: string;

  flip?: boolean;
}

export default function Feature({
  leftSide,
  rightSide,
  color,
  flip = false,
}: FeatureProps) {
  return (
    <div className=" sm:grid sm:grid-cols-2">
      <div
        className={cn(
          flip ? "sm:order-2" : "sm:order-1",
          "group relative flex h-full w-full items-center justify-center p-8",
          "aspect-square overflow-hidden text-center sm:p-16"
          // TODO: Find a great way to add merging borders
        )}
      >
        <Image
          src={leftSide.image}
          alt={leftSide.title}
          width={1000}
          height={1000}
          className={cn(
            "absolute top-0 left-0 h-full w-full",
            "blur-[4px] brightness-[0.75] transition duration-100"
          )}
        />
        <div className="z-10 w-full space-y-4">
          <h3 className="text-2xl font-semibold text-white transition duration-100 group-hover:scale-110 md:text-6xl">
            {leftSide.title}
          </h3>
          <p className="text-lg font-medium text-white md:text-2xl">
            {leftSide.subtitle}
          </p>
        </div>
      </div>
      <div
        className={cn(
          flip ? "sm:order-1" : "sm:order-2",
          color,
          "relative flex aspect-video w-full items-center justify-center p-8 text-center sm:aspect-square sm:p-16"
        )}
      >
        <div>{rightSide}</div>
      </div>
    </div>
  );
}
