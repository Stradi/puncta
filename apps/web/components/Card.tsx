import { cn } from "@/lib/utils";
import Image from "next/image";
interface CardProps extends React.ComponentPropsWithoutRef<"div"> {}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "h-full w-full",
        "border-2 border-black",
        "shadow-[8px_8px_0_0_rgba(0,0,0,1.0)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface InfoCardProps extends CardProps {
  image?: {
    src: string;
    alt: string;
  };
  title: string;
  description: React.ReactNode;
  footer: React.ReactNode;
}

export function InfoCard({
  image,
  title,
  description,
  footer,
  ...props
}: InfoCardProps) {
  return (
    <Card {...props} className={cn("flex flex-col", "divide-y-2 divide-black")}>
      <div className={cn("flex items-center gap-2 sm:gap-6")}>
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            width={100}
            height={100}
            unoptimized
            className="border-r-2 border-black"
          />
        )}
        <h2 className={cn("grow", "text-2xl font-semibold")}>{title}</h2>
      </div>
      <div className={cn("grow p-4", "text-xl font-medium")}>{description}</div>
      <div>{footer}</div>
    </Card>
  );
}
