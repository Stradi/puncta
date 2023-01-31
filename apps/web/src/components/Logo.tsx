import config from "@/config";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <div
        className={cn(
          "group relative h-full w-full select-none bg-black py-2 px-4"
        )}
      >
        <span
          data-brand={config.site.name}
          className={cn(
            "text-2xl font-semibold text-black",
            "tracking-tighter group-hover:after:tracking-normal",
            "after:transition-all after:duration-100",
            "after:absolute after:top-0 after:left-0 after:h-full after:w-full",
            "after:flex after:items-center after:justify-center",
            "after:text-white after:content-[attr(data-brand)]"
          )}
        >
          {config.site.name}
        </span>
      </div>
    </Link>
  );
}
