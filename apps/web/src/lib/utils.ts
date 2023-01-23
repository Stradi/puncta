import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAverage(values: number[]) {
  return values.reduce((a, b) => a + b) / values.length;
}

export function numberToLetterGrade(score: number) {
  if (score >= 85) {
    return "A";
  } else if (score >= 75) {
    return "B";
  } else if (score >= 60) {
    return "C";
  } else if (score >= 50) {
    return "D";
  } else {
    return "F";
  }
}

export function ratingsToLetterGrade(ratings: Rating[] | undefined) {
  if (!ratings || ratings.length === 0) {
    return "F";
  }

  const average = calculateAverage(ratings.map((rating) => rating.score));
  return numberToLetterGrade(average);
}
