import { cn, numberToLetterGrade, toReadableDate } from "@/lib/utils";
import LetterGrade from "./LetterGrade";

interface SingleRatingProps extends Rating {}

export default function SingleRating({
  id,
  score,
  comment,
  createdAt,
}: SingleRatingProps) {
  return (
    <div className={cn("flex flex-col md:flex-row")}>
      <LetterGrade
        letter={numberToLetterGrade(score)}
        size="large"
        className="h-auto min-h-[3rem] w-full shrink-0 justify-start pl-4 text-5xl md:min-h-[7rem] md:w-28 md:justify-center md:pl-0 md:text-8xl"
      />
      <div
        className={cn(
          "flex w-full flex-col justify-between gap-4 p-4",
          "border-x-2 border-b-2 border-black md:border-y-2 md:border-l-0 md:border-r-2"
        )}
      >
        <p className={cn("font-medium")}>{comment}</p>
        <div className="flex justify-between">
          <p className="text-sm font-medium">
            {toReadableDate(createdAt as string)}
          </p>
        </div>
      </div>
    </div>
  );
}
