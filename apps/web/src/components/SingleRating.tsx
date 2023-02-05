import {
  cn,
  getRatingMeta,
  ratingsToLetterGrade,
  toReadableDate,
} from "@/lib/utils";
import LetterGrade from "./LetterGrade";

interface SingleRatingProps extends React.PropsWithChildren<Rating> {}

export default function SingleRating({
  id,
  meta,
  comment,
  createdAt,
  children,
}: SingleRatingProps) {
  const criterias = getRatingMeta({
    meta,
  } as Rating);

  return (
    <div className={cn("group flex flex-col md:flex-row")}>
      <LetterGrade
        letter={ratingsToLetterGrade([
          {
            meta,
          },
        ] as Rating[])}
        size="large"
        className="h-auto min-h-[3rem] w-full shrink-0 justify-start pl-4 text-5xl md:min-h-[7rem] md:w-28 md:justify-center md:pl-0 md:text-8xl"
      />
      <div
        className={cn(
          "relative flex w-full flex-col justify-between gap-4 p-4",
          "border-x-2 border-b-2 border-black md:border-y-2 md:border-l-0 md:border-r-2"
        )}
      >
        <div className="text-sm font-medium">{children}</div>
        <hr></hr>
        <p className={cn("font-medium")}>{comment}</p>
        <div className="grid gap-x-4 md:grid-cols-2 lg:grid-cols-3">
          {criterias.map((criteria) => (
            <div key={criteria.name} className="flex justify-between">
              <span className="text-sm font-bold">
                {criteria.localizedName}
              </span>
              <span className="font-mono text-sm font-medium">
                {criteria.score.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <hr></hr>
        <div className="flex justify-between">
          <p className="text-sm font-medium">
            {toReadableDate(createdAt as string)}
          </p>
        </div>
      </div>
    </div>
  );
}
