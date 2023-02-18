import { cn } from "@/lib/utils";

interface TextProfileImageProps extends React.ComponentPropsWithoutRef<"div"> {
  name: string;
}

export default function TextProfileImage({
  name,
  className,
  ...rest
}: TextProfileImageProps) {
  const [firstLetter, secondLetter] = name.split(" ");
  const text = firstLetter[0] + (secondLetter && secondLetter[0]);

  return (
    <div
      title={`${name} için profil resmi`}
      className={cn(
        "flex aspect-square select-none items-center justify-center bg-primary-light-active",
        className
      )}
      {...rest}
    >
      <span
        data-text={text}
        className={cn("block font-mono text-4xl font-black tracking-wide")}
      >
        {text}
      </span>
    </div>
  );
}
