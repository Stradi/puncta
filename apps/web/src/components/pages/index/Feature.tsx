import { cn } from "@/lib/utils";

interface FeatureProps {
  leftSide: {
    title: string;
    subtitle: string;
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
    <div className="sm:grid sm:grid-cols-2">
      <div
        className={cn(
          flip ? "sm:order-2" : "sm:order-1",
          color,
          "text-black/60",
          "flex h-full w-full items-center justify-center p-8 text-center sm:aspect-square sm:p-16"
          // TODO: Find a great way to add merging borders
          // "mb-0.5 ml-0.5 shadow-[0_0_0_2px_rgba(0,0,0,1.0)]"
        )}
      >
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold md:text-6xl">
            {leftSide.title}
          </h3>
          <p className="text-lg font-medium md:text-2xl">{leftSide.subtitle}</p>
        </div>
      </div>
      <div
        className={cn(
          flip ? "sm:order-1" : "sm:order-2",
          "flex h-full w-full items-center justify-center p-8 text-center sm:aspect-square sm:p-16"
          // "mb-0.5 ml-0.5 shadow-[0_0_0_2px_rgba(0,0,0,1.0)]"
        )}
      >
        <div>{rightSide}</div>
      </div>
    </div>
  );
}
