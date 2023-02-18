import { cn, ratingsToLetterGrade } from "@/lib/utils";
import Link from "next/link";
import ConditionalWrapper from "./ConditionalWrapper";
import { InfoIcon } from "./Icons";
import LetterGrade from "./LetterGrade";
import { ProgressBarChart } from "./ProgressBarChart";
import TextProfileImage from "./TextProfileImage";

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
  title: string;
  description: React.ReactNode;
  footer: React.ReactNode;
}

export function InfoCard({
  title,
  description,
  footer,
  ...props
}: InfoCardProps) {
  return (
    <Card {...props} className={cn("flex flex-col", "divide-y-2 divide-black")}>
      <div className={cn("flex items-center gap-2 sm:gap-6")}>
        <TextProfileImage
          name={title}
          className="w-24 border-r-2 border-black"
        />
        <div className="space-y-2">
          <h2 className={cn("grow", "text-2xl font-semibold")}>{title}</h2>
        </div>
      </div>
      <div className={cn("grow p-4", "text-xl font-medium")}>{description}</div>
      <div>{footer}</div>
    </Card>
  );
}

interface OverallRatingCardProps extends CardProps {
  letterGrade: "A" | "B" | "C" | "D" | "F" | "N/A";
  gradeText?: string;

  scores?: {
    category: string;
    value: number;
    max: number;
    info: string;
  }[];
}

export function OverallRatingCard({
  letterGrade,
  gradeText,
  scores,
  ...props
}: OverallRatingCardProps) {
  return (
    <Card {...props} className={cn("space-y-4 p-4")}>
      <div className="flex items-center gap-4">
        <LetterGrade letter={letterGrade} size="large" className="shrink-0" />
        <p className="text-lg font-medium">{gradeText}</p>
      </div>
      {scores && scores.length > 0 && (
        <div className="space-y-4">
          {scores?.map((score) => (
            <div className="flex items-center gap-2" key={score.category}>
              <InfoIcon size="sm" />
              <p className="w-40 text-lg font-semibold">{score.category}</p>
              <ProgressBarChart
                value={score.value}
                max={score.max}
                size="small"
              />
              <p className="align-right w-40 text-right font-mono text-lg font-semibold">
                {score.value.toFixed(1)} / {score.max}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

interface CardWithRatingProps extends CardProps {
  ratings: Rating[];
  title: string;
  href?: string;
}

export function CardWithRating({ ratings, title, href }: CardWithRatingProps) {
  return (
    <ConditionalWrapper
      condition={!!href}
      wrapper={(children) => <Link href={href as string}>{children}</Link>}
    >
      <div
        className={cn(
          "flex h-24 items-center",
          href && "tranisition duration-100",
          href &&
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
          <h2 className={cn(" p-2", "text-xl font-medium")}>{title}</h2>
        </div>
      </div>
    </ConditionalWrapper>
  );
}

interface CardWithoutRatingProps extends CardProps {
  title: string;
  href?: string;
  subtitle?: React.ReactNode;
}

export function CardWithoutRating({
  title,
  href,
  subtitle,
}: CardWithoutRatingProps) {
  return (
    <ConditionalWrapper
      condition={!!href}
      wrapper={(children) => <Link href={href as string}>{children}</Link>}
    >
      <div
        className={cn(
          "flex h-24 items-center",
          href && "tranisition duration-100",
          href &&
            "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1.0)]"
        )}
      >
        <div
          className={cn(
            "flex h-full w-full flex-col items-center justify-center",
            "border-2 border-black"
          )}
        >
          <h2 className={cn(" p-2", "text-center text-xl")}>{title}</h2>
          {subtitle && <div>{subtitle}</div>}
        </div>
      </div>
    </ConditionalWrapper>
  );
}
