import LetterGrade from "@/components/LetterGrade";
import { cn, ratingsToLetterGrade } from "@/lib/utils";
import Link from "next/link";

interface SingleUniversityProps extends University {}

export default function SingleUniversity({
  id,
  name,
  slug,
  ratings,
}: SingleUniversityProps) {
  return (
    <Link
      href={`/universite/${slug}`}
      className={cn(
        "flex h-24 items-center",
        "tranisition duration-100",
        "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1.0)]"
      )}
    >
      <LetterGrade
        letter={ratingsToLetterGrade(ratings)}
        size="large"
        className="h-full w-24 shrink-0"
      />
      <div
        className={cn(
          "flex h-full w-full items-center",
          "border-y-2 border-r-2 border-black"
        )}
      >
        <h2 className={cn(" p-2", "text-xl font-medium")}>{name}</h2>
      </div>
    </Link>
  );
}
